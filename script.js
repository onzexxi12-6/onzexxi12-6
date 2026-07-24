// ===== DATA SISWA (sudah diurutkan A-Z) =====
const students = [
  "Abdul Hafiz [Class President]",
  "Adzra Falihah Saragih",
  "Al Mira Ariffa",
  "Amelia [Treasurer]",
  "Ardiyansah",
  "Dinda Kaesa Putri",
  "Fajar Wahyudi",
  "Fazira Ramadani",
  "Ikhsan Maghribi",
  "Laisa Ismayani",
  "M. Refan Farido",
  "Muhamad Aulia Ilham",
  "Muhammad Akbar Maulana",
  "Muhammad Alfarizi",
  "Muhammad Fahri Sanjaya",
  "Muhammad Fauzi",
  "Muhammad Himam Akbar",
  "Muhammad Irfan Hafiz [Vice Class President]",
  "Muhammad Sakhi Fitra Nugroho",
  "Najidla Azman [Developer]",
  "Nanda Syahputra",
  "Putri Nazira",
  "Siti Iqlima [Secretary]",
  "Sri Putri Sendari",
  "Suci Indriani",
  "Syifa Suhaila",
  "Tadzkia Yumna",
  "Wildaini Fitri",
  "Yulia",
  "M. Al Fatih Lubis [New Student]"
];

const studentListEl = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const noResultEl = document.getElementById("noResult");
const studentCountEl = document.getElementById("studentCount");

// Render daftar siswa
function renderStudents(list) {
  studentListEl.innerHTML = "";

  if (list.length === 0) {
    noResultEl.classList.remove("hidden");
    return;
  }
  noResultEl.classList.add("hidden");

  list.forEach((name) => {
    const originalIndex = students.indexOf(name) + 1;
    const card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
      <div class="student-num">${originalIndex}</div>
      <div class="student-name">${name}</div>
    `;
    studentListEl.appendChild(card);
  });
}

// Animasi hitung jumlah siswa
function animateCount(target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    studentCountEl.textContent = current;
  }, 25);
}

// Fitur pencarian nama siswa
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase().trim();
  const filtered = students.filter((name) =>
    name.toLowerCase().includes(keyword)
  );
  renderStudents(filtered);
});

// Tombol kembali ke atas
const toTopBtn = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    toTopBtn.classList.remove("hidden");
    toTopBtn.textContent = "↑";
  } else {
    toTopBtn.classList.remove("hidden");
    toTopBtn.textContent = "↓";
  }
});

toTopBtn.addEventListener("click", () => {
  if (window.scrollY > 400) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
});

// Toggle mode terang/gelap
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const isLight = html.getAttribute("data-theme") === "light";
  html.setAttribute("data-theme", isLight ? "dark" : "light");
  themeToggle.textContent = isLight ? "🌙" : "☀️";
});

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderStudents(students);
  animateCount(students.length);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuLinks = document.querySelectorAll('.menu-link');

// Buat overlay
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

function toggleMenu() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  overlay.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Tutup menu saat link diklik
// Tutup menu saat link diklik
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // Jika menuju halaman lain, biarkan browser membukanya
    if (!href.startsWith('#')) {
      toggleMenu();
      return;
    }

    e.preventDefault();

    toggleMenu();

    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 400);
  });
});

// Tutup menu saat resize ke desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 769 && mobileMenu.classList.contains('open')) {
    toggleMenu();
  }
});

// Agar klik pada scroll-hint bergerak secara mulus ke #struktur
const scrollHintBtn = document.querySelector('.scroll-hint');

if (scrollHintBtn) {
  scrollHintBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#struktur')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

// Mencegah klik kanan di seluruh halaman
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Mencegah shortcut keyboard untuk inspect element atau copy (Ctrl+C, Ctrl+U, F12, dll)
document.addEventListener('keydown', (e) => {
  // Mencegah F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+C
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && (e.key === 'u' || e.key === 'c' || e.key === 's'))
  ) {
    e.preventDefault();
    alert('Aksi ini dilarang di halaman ini!'); // Pesan peringatan opsional
  }
});

// Fitur Klik Foto untuk Zoom In dan Zoom Out kembali ke asal
const heroImg = document.querySelector('.hero-img');

if (heroImg) {
  // 1. Saat foto diklik, aktifkan/matikan zoom
  heroImg.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah klik pada foto langsung menutup kembali
    heroImg.classList.toggle('zoomed');
  });

  // 2. Saat area mana saja di luar/di layar diklik
  document.addEventListener('click', (e) => {
    // Jika yang diklik BUKAN fotonya DAN fotonya sedang dalam keadaan ter-zoom
    if (!heroImg.contains(e.target) && heroImg.classList.contains('zoomed')) {
      heroImg.classList.remove('zoomed'); // Kembalikan ke ukuran semula
    }
  });
}

// Mencegah zoom menggunakan Ctrl + Scroll mouse
window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Mencegah zoom menggunakan keyboard (Ctrl + Plus, Ctrl + Minus, Ctrl + Angka 0)
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
    e.preventDefault();
  }
});





const canvas = document.getElementById("blockBashCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");

let score = 0;
let isPlaying = false;

// Bola
let x = canvas.width / 2;
let y = canvas.height - 50;
let dx = 2;
let dy = -2;
const ballRadius = 6;

// Paddle (Papan pemantul)
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 15; // Posisi awal Y paddle

// Kontrol State (Keyboard, Mouse, Touch)
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("touchmove", touchMoveHandler, { passive: true });

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
  else if (e.key === "Up" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") upPressed = true;
  else if (e.key === "Down" || e.key === "ArrowDown" || e.key === "s" || e.key === "S") downPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
  else if (e.key === "Up" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") upPressed = false;
  else if (e.key === "Down" || e.key === "ArrowDown" || e.key === "s" || e.key === "S") downPressed = false;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  const relativeY = e.clientY - canvas.offsetTop;
  
  // Geser Horizontal (Kiri-Kanan)
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  // Geser Vertikal (Atas-Bawah) di area bawah canvas
  if (relativeY > canvas.height / 2 && relativeY < canvas.height - paddleHeight) {
    paddleY = relativeY;
  }
}

function touchMoveHandler(e) {
  const touch = e.touches[0];
  const relativeX = touch.clientX - canvas.offsetLeft;
  const relativeY = touch.clientY - canvas.offsetTop;
  
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  if (relativeY > canvas.height / 2 && relativeY < canvas.height - paddleHeight) {
    paddleY = relativeY;
  }
}

// Konfigurasi Balok (Bricks)
const brickRowCount = 3;
const brickColumnCount = 6;
const brickWidth = 65;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 22;

let bricks = [];
function initBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#ff6a3d';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#fff";
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#ff6a3d';
  ctx.shadowBlur = 10;
  ctx.shadowColor = ctx.fillStyle;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

// Tambahkan variabel pengatur kecepatan tambahan di bagian atas (dekat deklarasi dx & dy)
let baseSpeedX = 2;
let baseSpeedY = -2;
let speedMultiplier = 2;
let lastHitTime = 0;

function collisionDetection() {
  const currentTime = Date.now();

  // Cek apakah sudah lebih dari 500ms (1/2 detik) sejak hantaman terakhir
  if (isPlaying && lastHitTime > 0 && currentTime - lastHitTime > 500) {
    speedMultiplier = 1; // Reset kecepatan kembali normal
    // Normalisasi ulang kecepatan dx dan dy sesuai arah saat ini
    dx = Math.sign(dx) * Math.abs(baseSpeedX);
    dy = Math.sign(dy) * Math.abs(baseSpeedY);
  }

  // Deteksi benturan dengan balok (bricks)
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 10;
          scoreBoard.innerText = "Score: " + score;

          // Setiap kena balok, naikkan multiplier kecepatan & catat waktunya
          speedMultiplier = Math.min(speedMultiplier + 0.25, 2.5); // Maksimal 2.5x lipat
          lastHitTime = Date.now();

          // Terapkan kecepatan baru ke bola
          dx = Math.sign(dx) * (Math.abs(baseSpeedX) * speedMultiplier);
          dy = Math.sign(dy) * (Math.abs(baseSpeedY) * speedMultiplier);
          
          if (score === brickRowCount * brickColumnCount * 10) {
            alert("Wah, Menang! Lu berhasil hancurin semua balok!");
            document.location.reload();
          }
        }
      }
    }
  }

  // Deteksi benturan dengan Paddle
  if (
    x > paddleX && 
    x < paddleX + paddleWidth && 
    y + ballRadius >= paddleY && 
    y - ballRadius <= paddleY + paddleHeight &&
    dy > 0 
  ) {
    dy = -dy; 
    let hitPoint = x - (paddleX + paddleWidth / 2);
    dx = hitPoint * 0.15 * speedMultiplier; // Ikut sesuaikan dengan kecepatan aktif
  }
}



function draw() {
    
  if (!isPlaying) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Pantulan dinding kiri-kanan
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  
  // Pantulan dinding atas
  if (y + dy < ballRadius) {
    dy = -dy;
  } 
  // Cek Pantulan ke Paddle atau Game Over di bawah
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth && y >= paddleY && y <= paddleY + paddleHeight + 5) {
      dy = -dy;
    } else if (y > canvas.height) {
      isPlaying = false; // Matikan game loop
      
      // Tampilkan layar Game Over di dalam overlay
      document.getElementById("finalScore").innerText = "Skor Kamu: " + score;
      document.getElementById("gameOverScreen").classList.add("active");
    }
  }
  


  // Pergerakan Paddle via Keyboard (WASD / Panah)
  const paddleSpeed = 5;
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
  
  if (upPressed && paddleY > canvas.height / 2) {
    paddleY -= paddleSpeed;
  } else if (downPressed && paddleY < canvas.height - paddleHeight) {
    paddleY += paddleSpeed;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

canvas.addEventListener("touchmove", function(e) {
  e.preventDefault(); // Mencegah layar ikut scroll saat jari menggeser padel di canvas
  const touch = e.touches[0];
  const relativeX = touch.clientX - canvas.offsetLeft;
  const relativeY = touch.clientY - canvas.offsetTop;
  
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  if (relativeY > canvas.height / 2 && relativeY < canvas.height - paddleHeight) {
    paddleY = relativeY;
  }
}, { passive: false }); // Ubah jadi false agar e.preventDefault() berfungsi


// Tambahkan deklarasi animationId di sini jika belum ada
let animationId = null;

function startGame() {
  if (!isPlaying) {
    isPlaying = true;
    
    // Gunakan style.display agar konsisten
    const gameOverlay = document.getElementById("gameOverlay");
    if (gameOverlay) {
      gameOverlay.style.display = "flex";
    }
    
    document.body.style.overflow = "hidden";
    document.getElementById("gameOverScreen").classList.remove("active");
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    if (window.innerWidth < 500) {
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.6;
    }

    score = 0;
    scoreBoard.innerText = "Score: 0";
    x = canvas.width / 2;
    y = canvas.height - 50;
    dx = 2;
    dy = -2;
    speedMultiplier = 1;
    paddleX = (canvas.width - paddleWidth) / 2;

    initBricks();
    draw();
  }
}

function restartGame() {
  document.getElementById("gameOverScreen").classList.remove("active");
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  score = 0;
  scoreBoard.innerText = "Score: 0";
  x = canvas.width / 2;
  y = canvas.height - 50;
  dx = 2;
  dy = -2;
  speedMultiplier = 1;
  lastHitTime = 0;
  
  paddleX = (canvas.width - paddleWidth) / 2;
  paddleY = canvas.height - paddleHeight - 15;
  
  isPlaying = true;
  initBricks();
  draw();
}

function openGame() {
  startGame();
}

function exitGame() {
  isPlaying = false;
  
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  document.getElementById("gameOverScreen").classList.remove("active");
  
  const gameOverlay = document.getElementById("gameOverlay");
  if (gameOverlay) {
    gameOverlay.style.display = "none";
  }
  
  document.body.style.overflow = "auto";
}


function acceptInvitation() {
  const popup = document.getElementById("welcomePopup");
  popup.classList.add("hidden"); // Sembunyikan pop-up
  

  // Cari elemen bagian game dan geser halaman secara halus
  const gameSection = document.querySelector(".game-section");
  if (gameSection) {
    gameSection.scrollIntoView({ behavior: "smooth" });
  }
}


function acceptInvitational() {
  const popup = document.getElementById("welcomePopup");
  popup.classList.add("hidden"); // Sembunyikan pop-up
  
  // Cari elemen bagian game (pastikan section game lu punya class/id, misal class="game-section")
  const quranSection = document.querySelector(".quran-section");
  
  if (quranSection) {
    // Geser halaman secara halus (smooth scroll) ke arah bagian game
    quranSection.scrollIntoView({ behavior: "smooth" });
  }
}

function closePopup() {
  const popup = document.getElementById("welcomePopup");
  popup.classList.add("hidden"); // Cukup tutup pop-up kalau user pilih nanti
}


// Daftar Surat Juz 30 (Nomor Surah 78 sampai 114)
const juz30Surahs = [
  { nomor: 78, nama: "An-Naba'" },
  { nomor: 79, nama: "An-Nazi'at" },
  { nomor: 80, nama: "'Abasa" },
  { nomor: 81, nama: "At-Takwir" },
  { nomor: 82, nama: "Al-Infitar" },
  { nomor: 83, nama: "Al-Mutaffifin" },
  { nomor: 84, nama: "Al-Inshiqaq" },
  { nomor: 85, nama: "Al-Buruj" },
  { nomor: 86, nama: "At-Tariq" },
  { nomor: 87, nama: "Al-A'la" },
  { nomor: 88, nama: "Al-Ghashiyah" },
  { nomor: 89, nama: "Al-Fajr" },
  { nomor: 90, nama: "Al-Balad" },
  { nomor: 91, nama: "Ash-Shams" },
  { nomor: 92, nama: "Al-Lail" },
  { nomor: 93, nama: "Ad-Duha" },
  { nomor: 94, nama: "Ash-Sharh" },
  { nomor: 95, nama: "At-Tin" },
  { nomor: 96, nama: "Al-'Alaq" },
  { nomor: 97, nama: "Al-Qadr" },
  { nomor: 98, nama: "Al-Bayyinah" },
  { nomor: 99, nama: "Az-Zalzalah" },
  { nomor: 100, nama: "Al-'Adiyat" },
  { nomor: 101, nama: "Al-Qari'ah" },
  { nomor: 102, nama: "At-Takathur" },
  { nomor: 103, nama: "Al-'Asr" },
  { nomor: 104, nama: "Al-Humazah" },
  { nomor: 105, nama: "Al-Fil" },
  { nomor: 106, nama: "Quraisy" },
  { nomor: 107, nama: "Al-Ma'un" },
  { nomor: 108, nama: "Al-Kauthar" },
  { nomor: 109, nama: "Al-Kafirun" },
  { nomor: 110, nama: "An-Nasr" },
  { nomor: 111, nama: "Al-Lahab" },
  { nomor: 112, nama: "Al-Ikhlas" },
  { nomor: 113, nama: "Al-Falaq" },
  { nomor: 114, nama: "An-Nas" }
];

// Inisialisasi dropdown otomatis saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
  const select = document.getElementById("surahSelect");
  if (select) {
    juz30Surahs.forEach(s => {
      let opt = document.createElement("option");
      opt.value = s.nomor;
      opt.innerText = `Surat ${s.nama} (${s.nomor})`;
      select.appendChild(opt);
    });
  }
});

// Fungsi mengambil data ayat dari API publik
async function fetchSurah() {
  const select = document.getElementById("surahSelect");
  const container = document.getElementById("quranContainer");
  const surahId = select.value;

  if (!surahId) return;

  container.innerHTML = `<p class="quran-placeholder">Memuat ayat...</p>`;

  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${surahId}`);
    const data = await response.json();
    
    if (data.code === 200) {
      const surahData = data.data;
      let htmlContent = `<h3 style="text-align:center; color:var(--accent); margin-bottom:20px;">${surahData.namaLatin} (${surahData.arti})</h3>`;
      
      surahData.ayat.forEach(ayah => {
        htmlContent += `
          <div class="ayah-card">
            <div class="ayah-number">Ayat ${ayah.nomorAyat}</div>
            <div class="ayah-arabic">${ayah.teksArab}</div>
            <div class="ayah-latin">${ayah.teksLatin}</div>
            <div class="ayah-translation">${ayah.teksIndonesia}</div>
          </div>
        `;
      });
      
      container.innerHTML = htmlContent;
    } else {
      container.innerHTML = `<p class="quran-placeholder">Gagal memuat data surat.</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p class="quran-placeholder">Terjadi kesalahan koneksi internet.</p>`;
  }
}




document.addEventListener("DOMContentLoaded", () => {
  const bgVideo = document.getElementById("bgVideo");
  const bgMusic = document.getElementById("bgMusic");
  
  // Jalankan video background (aman karena muted)
  if (bgVideo) {
    bgVideo.play().catch(e => console.log("Video autoplay diblokir"));
  }
  
  // Fungsi untuk menyalakan musik saat ada interaksi pertama (klik/sentuh layar)
  const startAudio = () => {
    if (bgMusic) {
      bgMusic.volume = 0.5; // Atur volume (0.0 - 1.0)
      bgMusic.play().then(() => {
        // Jika berhasil nyala, hapus event listener-nya
        document.removeEventListener("click", startAudio);
        document.removeEventListener("touchstart", startAudio);
      }).catch(err => console.log("Audio menunggu interaksi user"));
    }
  };

  // Pasang pemicu sentuhan/klik di seluruh layar
  document.addEventListener("click", startAudio);
  document.addEventListener("touchstart", startAudio);
});


window.addEventListener("load", () => {
    const bgMusic = document.getElementById("bgMusic");

    if (!bgMusic) return;

    const savedTime = localStorage.getItem("musicTime");

    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    setInterval(() => {
        localStorage.setItem("musicTime", bgMusic.currentTime);
    }, 1000);
});