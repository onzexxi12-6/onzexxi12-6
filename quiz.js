/**
 * WebHack Interactive Quiz Application
 * Handles data fetching, UI routing, timer mechanics, scoring, sound effects, and confetti.
 */

// Global State
const state = {
    allQuestions: [],
    subjectsMap: {},
    selectedSubject: null,
    quizQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    settings: {
        count: 20,
        timerSec: 30,
        shuffle: true
    },
    liveScore: 0,
    currentStreak: 0,
    maxStreak: 0,
    timerInterval: null,
    totalTimeInterval: null,
    timerRemaining: 0,
    totalTimeElapsed: 0,
    soundEnabled: true,
    darkTheme: true
};

// Subject Information Setup
const SUBJECT_CONFIG = {
    english: { title: "Bahasa Inggris", icon: "fa-language", desc: "Grammar, vocabulary, dan pemahaman kalimat." },
    mathematics: { title: "Matematika", icon: "fa-calculator", desc: "Logaritma, fungsi, trigonometri, dan persamaan." },
    history: { title: "Sejarah", icon: "fa-landmark", desc: "Peristiwa penting, tokoh sejarah, dan peradaban." },
    aqidah_akhlak: { title: "Aqidah Akhlak", icon: "fa-heart-pulse", desc: "Pemahaman tauhid, rukun iman, dan moralitas." },
    ski: { title: "Sejarah Kebudayaan Islam", icon: "fa-book-quran", desc: "Perkembangan peradaban Islam dan kisah sahabat." },
    all: { title: "Semua Subjek", icon: "fa-layer-group", desc: "Gabungan soal acak dari seluruh kategori pelajaran." }
};

// Web Audio API Synthesizer
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(freq, type, duration, delay = 0) {
    if (!state.soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        
        setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        }, delay * 1000);
    } catch (e) {
        console.warn("Audio error:", e);
    }
}

function playCorrectSound() {
    playTone(523.25, 'sine', 0.15, 0);       // C5
    playTone(659.25, 'sine', 0.15, 0.1);     // E5
    playTone(783.99, 'sine', 0.25, 0.2);     // G5
}

function playWrongSound() {
    playTone(220.00, 'sawtooth', 0.2, 0);     // A3
    playTone(196.00, 'sawtooth', 0.3, 0.15);   // G3
}

function playFinishSound() {
    playTone(523.25, 'triangle', 0.15, 0);
    playTone(659.25, 'triangle', 0.15, 0.12);
    playTone(783.99, 'triangle', 0.15, 0.24);
    playTone(1046.50, 'triangle', 0.4, 0.36);
}

function playClickSound() {
    playTone(440, 'sine', 0.05, 0);
}

// DOM Elements
const elements = {
    // Screens
    screenSubject: document.getElementById('screen-subject'),
    screenQuiz: document.getElementById('screen-quiz'),
    screenResult: document.getElementById('screen-result'),

    // Header Controls
    btnGoHome: document.getElementById('btn-go-home'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),

    // Screen 1: Subject Selection
    subjectGrid: document.getElementById('subject-grid'),
    settingQuestionCount: document.getElementById('setting-question-count'),
    settingTimer: document.getElementById('setting-timer'),
    settingShuffle: document.getElementById('setting-shuffle'),
    btnStartQuiz: document.getElementById('btn-start-quiz'),

    // Screen 2: Quiz
    quizSubjectBadge: document.getElementById('quiz-subject-badge'),
    currentQIndex: document.getElementById('current-q-index'),
    totalQCount: document.getElementById('total-q-count'),
    timerContainer: document.getElementById('timer-container'),
    timerText: document.getElementById('timer-text'),
    streakCount: document.getElementById('streak-count'),
    liveScore: document.getElementById('live-score'),
    progressBar: document.getElementById('quiz-progress-bar'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackBanner: document.getElementById('feedback-banner'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackDesc: document.getElementById('feedback-desc'),
    btnBookmark: document.getElementById('btn-bookmark'),
    btnPrevQ: document.getElementById('btn-prev-q'),
    btnNextQ: document.getElementById('btn-next-q'),

    // Screen 3: Results
    finalPercentage: document.getElementById('final-percentage'),
    scoreCircleBar: document.getElementById('score-circle-bar'),
    resultGradeBadge: document.getElementById('result-grade-badge'),
    resultTitle: document.getElementById('result-title'),
    resultSubtitle: document.getElementById('result-subtitle'),
    statCorrectCount: document.getElementById('stat-correct-count'),
    statWrongCount: document.getElementById('stat-wrong-count'),
    statMaxStreak: document.getElementById('stat-max-streak'),
    statTotalTime: document.getElementById('stat-total-time'),
    btnRestartQuiz: document.getElementById('btn-restart-quiz'),
    btnChooseOther: document.getElementById('btn-choose-other'),
    reviewList: document.getElementById('review-list'),
    filterCountAll: document.getElementById('filter-count-all'),
    filterCountCorrect: document.getElementById('filter-count-correct'),
    filterCountIncorrect: document.getElementById('filter-count-incorrect')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    initBackgroundParticles();
    await loadQuizData();
}

// Load Quiz Data from answer.json
async function loadQuizData() {
    try {
        const response = await fetch('./answer.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        state.allQuestions = await response.json();
        processSubjectsData();
        renderSubjectGrid();
    } catch (error) {
        console.error('Gagal memuat answer.json:', error);
        elements.subjectGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--danger);"></i>
                <p>Gagal memuat file <code>answer.json</code>.</p>
                <small style="color: var(--text-muted);">Pastikan file answer.json tersedia di direktori web server.</small>
            </div>
        `;
    }
}

// Process data to count questions per subject
function processSubjectsData() {
    state.subjectsMap = {};
    state.allQuestions.forEach(q => {
        const subj = q.subject;
        if (!state.subjectsMap[subj]) {
            state.subjectsMap[subj] = 0;
        }
        state.subjectsMap[subj]++;
    });
}

// Render Subject Selection Grid
function renderSubjectGrid() {
    elements.subjectGrid.innerHTML = '';
    
    // Add "All Subjects" card first
    const allCard = createSubjectCard('all', state.allQuestions.length);
    elements.subjectGrid.appendChild(allCard);

    // Add cards for each subject found in answer.json
    Object.keys(state.subjectsMap).forEach(subjKey => {
        const card = createSubjectCard(subjKey, state.subjectsMap[subjKey]);
        elements.subjectGrid.appendChild(card);
    });
}

function createSubjectCard(subjectKey, count) {
    const config = SUBJECT_CONFIG[subjectKey] || {
        title: subjectKey.replace('_', ' ').toUpperCase(),
        icon: 'fa-book',
        desc: `Kumpulan ${count} pertanyaan.`
    };

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.subject = subjectKey;
    card.innerHTML = `
        <div class="subject-card-header">
            <div class="subject-icon-box">
                <i class="fa-solid ${config.icon}"></i>
            </div>
            <span class="subject-badge-count">${count} Soal</span>
        </div>
        <h4>${config.title}</h4>
        <p>${config.desc}</p>
    `;

    card.addEventListener('click', () => selectSubject(subjectKey, card));
    return card;
}

function selectSubject(subjectKey, cardElement) {
    playClickSound();
    document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    state.selectedSubject = subjectKey;

    // Enable Start Button
    elements.btnStartQuiz.classList.remove('disabled');
    elements.btnStartQuiz.removeAttribute('disabled');
}

// Route Screens
function showScreen(screenId) {
    [elements.screenSubject, elements.screenQuiz, elements.screenResult].forEach(scr => {
        scr.classList.remove('active');
    });
    
    setTimeout(() => {
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }, 50);
}

// Setup Global Event Listeners
function setupEventListeners() {
    // Header Controls
    elements.btnGoHome.addEventListener('click', () => {
        playClickSound();
        resetQuizState();
        showScreen('screen-subject');
    });

    elements.btnSoundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        elements.btnSoundToggle.innerHTML = state.soundEnabled ? 
            '<i class="fa-solid fa-volume-high"></i>' : 
            '<i class="fa-solid fa-volume-xmark"></i>';
        elements.btnSoundToggle.style.color = state.soundEnabled ? 'var(--text-main)' : 'var(--danger)';
        playClickSound();
    });

    elements.btnThemeToggle.addEventListener('click', () => {
        state.darkTheme = !state.darkTheme;
        document.body.classList.toggle('light-theme', !state.darkTheme);
        elements.btnThemeToggle.innerHTML = state.darkTheme ? 
            '<i class="fa-solid fa-moon"></i>' : 
            '<i class="fa-solid fa-sun"></i>';
        playClickSound();
    });

    // Start Quiz Button
    elements.btnStartQuiz.addEventListener('click', () => {
        if (!state.selectedSubject) return;
        playClickSound();
        startQuizSession();
    });

    // Navigation Buttons
    elements.btnNextQ.addEventListener('click', () => {
        playClickSound();
        goToNextQuestion();
    });

    elements.btnPrevQ.addEventListener('click', () => {
        playClickSound();
        goToPrevQuestion();
    });

    // Bookmark Toggle
    elements.btnBookmark.addEventListener('click', () => {
        playClickSound();
        const currentAnsObj = state.userAnswers[state.currentQuestionIndex];
        currentAnsObj.isBookmarked = !currentAnsObj.isBookmarked;
        updateBookmarkUI();
    });

    // Result Action Buttons
    elements.btnRestartQuiz.addEventListener('click', () => {
        playClickSound();
        startQuizSession();
    });

    elements.btnChooseOther.addEventListener('click', () => {
        playClickSound();
        resetQuizState();
        showScreen('screen-subject');
    });

    // Review Filters
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            playClickSound();
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterReviewList(e.target.dataset.filter);
        });
    });

    // Keyboard Navigation Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
    if (!elements.screenQuiz.classList.contains('active')) return;

    // Number keys 1-4 or letters A-D to select options
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    const lowerKey = e.key.toLowerCase();
    
    if (lowerKey in keyMap) {
        const optionIndex = keyMap[lowerKey];
        const optionBtns = elements.optionsContainer.querySelectorAll('.option-button');
        if (optionBtns[optionIndex] && !optionBtns[optionIndex].classList.contains('disabled')) {
            optionBtns[optionIndex].click();
        }
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (!elements.btnNextQ.disabled) {
            elements.btnNextQ.click();
        }
    } else if (e.key === 'ArrowLeft') {
        if (!elements.btnPrevQ.disabled) {
            elements.btnPrevQ.click();
        }
    }
}

// Start Quiz Logic
function startQuizSession() {
    // Read Settings
    const countVal = elements.settingQuestionCount.value;
    state.settings.count = countVal === 'all' ? 'all' : parseInt(countVal, 10);
    state.settings.timerSec = parseInt(elements.settingTimer.value, 10);
    state.settings.shuffle = elements.settingShuffle.checked;

    // Filter questions by subject
    let filtered = [];
    if (state.selectedSubject === 'all') {
        filtered = [...state.allQuestions];
    } else {
        filtered = state.allQuestions.filter(q => q.subject === state.selectedSubject);
    }

    // Shuffle questions if enabled
    if (state.settings.shuffle) {
        filtered = shuffleArray(filtered);
    }

    // Slice question count according to settings
    if (state.settings.count !== 'all' && typeof state.settings.count === 'number') {
        filtered = filtered.slice(0, state.settings.count);
    }

    state.quizQuestions = filtered;
    state.currentQuestionIndex = 0;
    state.liveScore = 0;
    state.currentStreak = 0;
    state.maxStreak = 0;
    state.totalTimeElapsed = 0;

    // Build user answers record
    state.userAnswers = state.quizQuestions.map(q => {
        let opts = [...q.options];
        if (state.settings.shuffle) {
            opts = shuffleArray(opts);
        }
        return {
            question: q.question,
            options: opts,
            correctAnswer: q.answer,
            subject: q.subject,
            userAnswer: null,
            isCorrect: false,
            timeTaken: 0,
            isBookmarked: false
        };
    });

    // Update Header Badges
    const config = SUBJECT_CONFIG[state.selectedSubject] || { title: state.selectedSubject.toUpperCase() };
    elements.quizSubjectBadge.textContent = config.title;
    elements.totalQCount.textContent = state.quizQuestions.length;
    elements.liveScore.textContent = '0';
    elements.streakCount.textContent = '0';

    // Start Total Timer
    clearInterval(state.totalTimeInterval);
    state.totalTimeInterval = setInterval(() => {
        state.totalTimeElapsed++;
    }, 1000);

    showScreen('screen-quiz');
    renderQuestion(0);
}

// Render Current Question
function renderQuestion(index) {
    state.currentQuestionIndex = index;
    const currentQ = state.quizQuestions[index];
    const currentAns = state.userAnswers[index];

    // Update Question Counter & Progress
    elements.currentQIndex.textContent = index + 1;
    const progressPct = ((index + 1) / state.quizQuestions.length) * 100;
    elements.progressBar.style.width = `${progressPct}%`;

    // Question Text & Bookmark UI
    elements.questionText.textContent = currentQ.question;
    updateBookmarkUI();

    // Render Options
    elements.optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    currentAns.options.forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        if (currentAns.userAnswer !== null) {
            btn.classList.add('disabled');
        }

        const isUserChoice = currentAns.userAnswer === optText;
        const isCorrectChoice = currentAns.correctAnswer === optText;

        if (currentAns.userAnswer !== null) {
            if (isCorrectChoice) {
                btn.classList.add('correct');
            } else if (isUserChoice) {
                btn.classList.add('incorrect');
            }
        }

        btn.innerHTML = `
            <div class="option-badge">${letters[i] || (i + 1)}</div>
            <div class="option-text">${escapeHtml(optText)}</div>
        `;

        btn.addEventListener('click', () => handleAnswerSelect(optText));
        elements.optionsContainer.appendChild(btn);
    });

    // Update Feedback Banner
    if (currentAns.userAnswer !== null) {
        showFeedbackBanner(currentAns.isCorrect, currentAns.correctAnswer);
    } else {
        elements.feedbackBanner.classList.add('hidden');
    }

    // Update Navigation Buttons
    elements.btnPrevQ.disabled = index === 0;
    
    if (currentAns.userAnswer !== null) {
        elements.btnNextQ.disabled = false;
        elements.btnNextQ.querySelector('span').textContent = (index === state.quizQuestions.length - 1) ? 'Lihat Hasil' : 'Selanjutnya';
    } else {
        elements.btnNextQ.disabled = true;
    }

    // Reset / Start Timer for current question
    startQuestionTimer();
}

// Question Timer Handler
function startQuestionTimer() {
    clearInterval(state.timerInterval);
    
    if (state.settings.timerSec === 0) {
        elements.timerContainer.style.display = 'none';
        return;
    }

    elements.timerContainer.style.display = 'flex';
    elements.timerContainer.classList.remove('warning');
    
    const currentAns = state.userAnswers[state.currentQuestionIndex];
    if (currentAns.userAnswer !== null) {
        // Already answered, just show remaining / 0
        elements.timerText.textContent = `${state.settings.timerSec}s`;
        return;
    }

    state.timerRemaining = state.settings.timerSec;
    elements.timerText.textContent = `${state.timerRemaining}s`;

    state.timerInterval = setInterval(() => {
        state.timerRemaining--;
        elements.timerText.textContent = `${state.timerRemaining}s`;

        if (state.timerRemaining <= 5) {
            elements.timerContainer.classList.add('warning');
        }

        if (state.timerRemaining <= 0) {
            clearInterval(state.timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    const currentAns = state.userAnswers[state.currentQuestionIndex];
    if (currentAns.userAnswer === null) {
        // Auto select empty / wrong
        handleAnswerSelect("__TIMEOUT__");
    }
}

// Answer Selection Logic
function handleAnswerSelect(selectedOption) {
    const currentAns = state.userAnswers[state.currentQuestionIndex];
    if (currentAns.userAnswer !== null) return; // Prevent double select

    clearInterval(state.timerInterval);

    const isCorrect = (selectedOption === currentAns.correctAnswer);
    currentAns.userAnswer = selectedOption;
    currentAns.isCorrect = isCorrect;
    currentAns.timeTaken = state.settings.timerSec - state.timerRemaining;

    // Update Score & Streak
    if (isCorrect) {
        state.liveScore += 100 + (state.currentStreak * 10);
        state.currentStreak++;
        if (state.currentStreak > state.maxStreak) {
            state.maxStreak = state.currentStreak;
        }
        playCorrectSound();
    } else {
        state.currentStreak = 0;
        playWrongSound();
    }

    elements.liveScore.textContent = state.liveScore;
    elements.streakCount.textContent = state.currentStreak;

    // Re-render options with feedback
    renderQuestion(state.currentQuestionIndex);
}

function showFeedbackBanner(isCorrect, correctAnswer) {
    elements.feedbackBanner.classList.remove('hidden', 'correct', 'incorrect');
    
    if (isCorrect) {
        elements.feedbackBanner.classList.add('correct');
        elements.feedbackTitle.textContent = 'Jawaban Benar! 🎉';
        elements.feedbackDesc.textContent = 'Hebat, pilihan kamu tepat sekali.';
    } else {
        elements.feedbackBanner.classList.add('incorrect');
        elements.feedbackTitle.textContent = 'Jawaban Belum Tepat ❌';
        elements.feedbackDesc.textContent = `Jawaban yang benar adalah: "${correctAnswer}"`;
    }
}

function updateBookmarkUI() {
    const currentAns = state.userAnswers[state.currentQuestionIndex];
    if (currentAns && currentAns.isBookmarked) {
        elements.btnBookmark.classList.add('active');
        elements.btnBookmark.querySelector('i').className = 'fa-solid fa-bookmark';
    } else {
        elements.btnBookmark.classList.remove('active');
        elements.btnBookmark.querySelector('i').className = 'fa-regular fa-bookmark';
    }
}

// Navigation between questions
function goToNextQuestion() {
    if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
        renderQuestion(state.currentQuestionIndex + 1);
    } else {
        finishQuizSession();
    }
}

function goToPrevQuestion() {
    if (state.currentQuestionIndex > 0) {
        renderQuestion(state.currentQuestionIndex - 1);
    }
}

// Finish Quiz & Show Results Screen
function finishQuizSession() {
    clearInterval(state.timerInterval);
    clearInterval(state.totalTimeInterval);
    playFinishSound();

    const totalQ = state.quizQuestions.length;
    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const wrongCount = totalQ - correctCount;
    const percentage = Math.round((correctCount / totalQ) * 100);

    // Update Results UI Text
    elements.finalPercentage.textContent = `${percentage}%`;
    elements.statCorrectCount.textContent = correctCount;
    elements.statWrongCount.textContent = wrongCount;
    elements.statMaxStreak.textContent = `${state.maxStreak}x`;
    elements.statTotalTime.textContent = formatTime(state.totalTimeElapsed);

    // Animate Circle Bar (Max circumference ~ 326.72)
    const circleBar = elements.scoreCircleBar;
    const offset = 326.72 - (326.72 * (percentage / 100));
    setTimeout(() => {
        circleBar.style.strokeDashoffset = offset;
    }, 200);

    // Grade and Title determination
    let grade = 'Grade C';
    let title = 'Tetap Semangat & Terus Berlatih!';
    let subtitle = 'Jangan berkecil hati, cobalah mengulas jawaban yang salah dan mulai kuis kembali.';

    if (percentage >= 90) {
        grade = 'Grade S ⭐';
        title = 'Luar Biasa! Sempurna!';
        subtitle = 'Kamu telah menguasai materi ini dengan sangat sempurna.';
        triggerConfetti();
    } else if (percentage >= 75) {
        grade = 'Grade A 👍';
        title = 'Sangat Baik!';
        subtitle = 'Pemahaman kamu pada materi ini sudah sangat kuat.';
        triggerConfetti();
    } else if (percentage >= 60) {
        grade = 'Grade B 👌';
        title = 'Hasil yang Cukup Bagus!';
        subtitle = 'Tingkatkan sedikit lagi latihan untuk mencapai skor maksimal.';
    }

    elements.resultGradeBadge.textContent = grade;
    elements.resultTitle.textContent = title;
    elements.resultSubtitle.textContent = subtitle;

    // Render Answer Review List
    renderReviewList();

    showScreen('screen-result');
}

// Render Review Answer List
function renderReviewList() {
    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const wrongCount = state.userAnswers.length - correctCount;

    elements.filterCountAll.textContent = state.userAnswers.length;
    elements.filterCountCorrect.textContent = correctCount;
    elements.filterCountIncorrect.textContent = wrongCount;

    filterReviewList('all');
}

function filterReviewList(filter) {
    elements.reviewList.innerHTML = '';

    state.userAnswers.forEach((ans, idx) => {
        if (filter === 'correct' && !ans.isCorrect) return;
        if (filter === 'incorrect' && ans.isCorrect) return;

        const item = document.createElement('div');
        item.className = `review-item ${ans.isCorrect ? 'is-correct' : 'is-incorrect'}`;
        
        const userChoiceText = ans.userAnswer === '__TIMEOUT__' ? '(Waktu Habis)' : (ans.userAnswer || '(Tidak Dijawab)');
        
        item.innerHTML = `
            <div class="review-item-header">
                <div class="review-question">${idx + 1}. ${escapeHtml(ans.question)}</div>
                <div class="review-status-badge ${ans.isCorrect ? 'correct' : 'incorrect'}">
                    <i class="fa-solid ${ans.isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
                    ${ans.isCorrect ? 'Benar' : 'Salah'}
                </div>
            </div>
            <div class="review-answers">
                <div class="review-ans-row">
                    <span class="review-ans-label">Jawaban Kamu:</span>
                    <span class="review-ans-val ${ans.isCorrect ? 'correct-val' : 'wrong-val'}">${escapeHtml(userChoiceText)}</span>
                </div>
                ${!ans.isCorrect ? `
                <div class="review-ans-row">
                    <span class="review-ans-label">Jawaban Benar:</span>
                    <span class="review-ans-val correct-val">${escapeHtml(ans.correctAnswer)}</span>
                </div>
                ` : ''}
            </div>
        `;

        elements.reviewList.appendChild(item);
    });
}

function resetQuizState() {
    clearInterval(state.timerInterval);
    clearInterval(state.totalTimeInterval);
    state.selectedSubject = null;
    document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
    elements.btnStartQuiz.classList.add('disabled');
    elements.btnStartQuiz.setAttribute('disabled', 'true');
}

// Utility Functions
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* Background Particle Animation */
function initBackgroundParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const particleColor = state.darkTheme ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.2)';
        const lineColor = state.darkTheme ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* Canvas Confetti Animation */
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 3,
        size: Math.random() * 8 + 4,
        color: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 6)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6
    }));

    let animationFrame;
    let frames = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frames++;

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (frames < 200) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
        }
    }

    animate();
}
