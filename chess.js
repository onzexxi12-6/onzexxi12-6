/* ================================================
   CATUR ONZEXXI 12-6
   Engine catur vanilla JS: legal moves, skak,
   skakmat, castling, en passant, promosi pion.
================================================= */

const FILES = ['a','b','c','d','e','f','g','h'];
const UNICODE = {
  K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
  k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟'
};

function initialBoard() {
  return [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
  ];
}

let state = null;

function newGame() {
  state = {
    board: initialBoard(),
    turn: 'w',
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    enPassant: null, // {row, col}
    captured: { w: [], b: [] },
    history: [],
    status: 'playing', // playing | check | checkmate | stalemate
    selected: null,
    legalTargets: [],
  };
  render();
}

function pieceColor(p) { return p ? (p === p.toUpperCase() ? 'w' : 'b') : null; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(row => row.slice()); }

function findKing(board, color) {
  const target = color === 'w' ? 'K' : 'k';
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === target) return { row: r, col: c };
  return null;
}

/* Cek apakah kotak (row,col) diserang oleh warna byColor */
function isSquareAttacked(board, row, col, byColor) {
  const dir = byColor === 'w' ? -1 : 1;
  // Serangan pion
  for (const dc of [-1, 1]) {
    const r = row + dir, c = col + dc;
    if (inBounds(r, c)) {
      const p = board[r][c];
      if (p && pieceColor(p) === byColor && p.toUpperCase() === 'P') return true;
    }
  }
  // Serangan kuda
  const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of knightMoves) {
    const r = row + dr, c = col + dc;
    if (inBounds(r, c)) {
      const p = board[r][c];
      if (p && pieceColor(p) === byColor && p.toUpperCase() === 'N') return true;
    }
  }
  // Serangan raja (sekitar 1 kotak)
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr, c = col + dc;
      if (inBounds(r, c)) {
        const p = board[r][c];
        if (p && pieceColor(p) === byColor && p.toUpperCase() === 'K') return true;
      }
    }
  // Serangan sliding: benteng/ratu (lurus)
  const straight = [[-1,0],[1,0],[0,-1],[0,1]];
  for (const [dr, dc] of straight) {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (pieceColor(p) === byColor && (p.toUpperCase() === 'R' || p.toUpperCase() === 'Q')) return true;
        break;
      }
      r += dr; c += dc;
    }
  }
  // Serangan sliding: gajah/ratu (diagonal)
  const diag = [[-1,-1],[-1,1],[1,-1],[1,1]];
  for (const [dr, dc] of diag) {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (pieceColor(p) === byColor && (p.toUpperCase() === 'B' || p.toUpperCase() === 'Q')) return true;
        break;
      }
      r += dr; c += dc;
    }
  }
  return false;
}

function isInCheck(board, color) {
  const king = findKing(board, color);
  if (!king) return false;
  const enemy = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, king.row, king.col, enemy);
}

/* Generate pseudo-legal moves (belum cek skak sendiri) untuk satu bidak */
function pseudoMoves(st, row, col) {
  const board = st.board;
  const piece = board[row][col];
  if (!piece) return [];
  const color = pieceColor(piece);
  const type = piece.toUpperCase();
  const moves = [];

  const addIfValid = (r, c, mustCapture = false, canCapture = true) => {
    if (!inBounds(r, c)) return false;
    const target = board[r][c];
    if (!target) {
      if (!mustCapture) moves.push({ row: r, col: c });
      return true;
    } else {
      if (canCapture && pieceColor(target) !== color) moves.push({ row: r, col: c, capture: true });
      return false;
    }
  };

  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    // Maju satu
    if (inBounds(row + dir, col) && !board[row + dir][col]) {
      moves.push({ row: row + dir, col, promote: (row + dir === 0 || row + dir === 7) });
      // Maju dua dari posisi awal
      if (row === startRow && !board[row + 2 * dir][col]) {
        moves.push({ row: row + 2 * dir, col, doubleStep: true });
      }
    }
    // Tangkap diagonal
    for (const dc of [-1, 1]) {
      const r = row + dir, c = col + dc;
      if (inBounds(r, c)) {
        const target = board[r][c];
        if (target && pieceColor(target) !== color) {
          moves.push({ row: r, col: c, capture: true, promote: (r === 0 || r === 7) });
        } else if (st.enPassant && st.enPassant.row === r && st.enPassant.col === c) {
          moves.push({ row: r, col: c, capture: true, enPassant: true });
        }
      }
    }
  } else if (type === 'N') {
    const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of knightMoves) addIfValid(row + dr, col + dc);
  } else if (type === 'K') {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        addIfValid(row + dr, col + dc);
      }
    // Castling
    const enemy = color === 'w' ? 'b' : 'w';
    const homeRow = color === 'w' ? 7 : 0;
    if (row === homeRow && col === 4 && !isSquareAttacked(board, row, col, enemy)) {
      const kSideRight = st.castling[color + 'K'];
      const qSideRight = st.castling[color + 'Q'];
      if (kSideRight && !board[homeRow][5] && !board[homeRow][6] &&
          !isSquareAttacked(board, homeRow, 5, enemy) && !isSquareAttacked(board, homeRow, 6, enemy)) {
        moves.push({ row: homeRow, col: 6, castle: 'K' });
      }
      if (qSideRight && !board[homeRow][1] && !board[homeRow][2] && !board[homeRow][3] &&
          !isSquareAttacked(board, homeRow, 2, enemy) && !isSquareAttacked(board, homeRow, 3, enemy)) {
        moves.push({ row: homeRow, col: 2, castle: 'Q' });
      }
    }
  } else {
    let dirs = [];
    if (type === 'R') dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    if (type === 'B') dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    if (type === 'Q') dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    for (const [dr, dc] of dirs) {
      let r = row + dr, c = col + dc;
      while (inBounds(r, c)) {
        const target = board[r][c];
        if (!target) { moves.push({ row: r, col: c }); }
        else { if (pieceColor(target) !== color) moves.push({ row: r, col: c, capture: true }); break; }
        r += dr; c += dc;
      }
    }
  }
  return moves;
}

/* Terapkan move ke clone board (untuk simulasi maupun eksekusi asli) */
function applyMove(st, from, move) {
  const board = cloneBoard(st.board);
  const piece = board[from.row][from.col];
  const color = pieceColor(piece);
  let captured = null;

  if (move.enPassant) {
    const capRow = color === 'w' ? move.row + 1 : move.row - 1;
    captured = board[capRow][move.col];
    board[capRow][move.col] = null;
  } else if (move.capture) {
    captured = board[move.row][move.col];
  }

  board[move.row][move.col] = piece;
  board[from.row][from.col] = null;

  if (move.promote) {
    const promo = move.promoteTo || 'Q';
    board[move.row][move.col] = color === 'w' ? promo.toUpperCase() : promo.toLowerCase();
  }

  const castling = { ...st.castling };
  if (move.castle === 'K') {
    const homeRow = color === 'w' ? 7 : 0;
    board[homeRow][5] = board[homeRow][7];
    board[homeRow][7] = null;
  }
  if (move.castle === 'Q') {
    const homeRow = color === 'w' ? 7 : 0;
    board[homeRow][3] = board[homeRow][0];
    board[homeRow][0] = null;
  }
  if (piece.toUpperCase() === 'K') { castling[color + 'K'] = false; castling[color + 'Q'] = false; }
  if (piece.toUpperCase() === 'R') {
    const homeRow = color === 'w' ? 7 : 0;
    if (from.row === homeRow && from.col === 0) castling[color + 'Q'] = false;
    if (from.row === homeRow && from.col === 7) castling[color + 'K'] = false;
  }
  // Jika benteng lawan tertangkap, cabut hak castling lawan di sisi itu
  if (captured && captured.toUpperCase() === 'R') {
    const enemy = color === 'w' ? 'b' : 'w';
    const enemyHome = enemy === 'w' ? 7 : 0;
    if (move.row === enemyHome && move.col === 0) castling[enemy + 'Q'] = false;
    if (move.row === enemyHome && move.col === 7) castling[enemy + 'K'] = false;
  }

  let enPassant = null;
  if (move.doubleStep) {
    const midRow = (from.row + move.row) / 2;
    enPassant = { row: midRow, col: from.col };
  }

  return { board, castling, enPassant, captured };
}

/* Legal moves = pseudo moves yang tidak membuat raja sendiri skak */
function legalMoves(st, row, col) {
  const piece = st.board[row][col];
  if (!piece) return [];
  const color = pieceColor(piece);
  const pseudo = pseudoMoves(st, row, col);
  return pseudo.filter(move => {
    const result = applyMove(st, { row, col }, move);
    return !isInCheck(result.board, color);
  });
}

function allLegalMoves(st, color) {
  const all = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = st.board[r][c];
      if (p && pieceColor(p) === color) {
        const moves = legalMoves(st, r, c);
        moves.forEach(m => all.push({ from: { row: r, col: c }, move: m }));
      }
    }
  return all;
}

/* ================= UI ================= */

const boardEl = document.getElementById('chessBoard');
const statusEl = document.getElementById('statusText');
const turnEl = document.getElementById('turnIndicator');
const capturedWEl = document.getElementById('capturedByWhite');
const capturedBEl = document.getElementById('capturedByBlack');
const promoModal = document.getElementById('promoModal');
const resetBtn = document.getElementById('resetBtn');

let pendingPromotion = null;

function squareColorClass(r, c) { return (r + c) % 2 === 0 ? 'sq-light' : 'sq-dark'; }

function render() {
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = `chess-square ${squareColorClass(r, c)}`;
      sq.dataset.row = r;
      sq.dataset.col = c;

      const piece = state.board[r][c];
      if (piece) {
        const span = document.createElement('span');
        span.className = `chess-piece ${pieceColor(piece) === 'w' ? 'piece-white' : 'piece-black'}`;
        span.textContent = UNICODE[piece];
        sq.appendChild(span);
      }

      if (state.selected && state.selected.row === r && state.selected.col === c) {
        sq.classList.add('sq-selected');
      }
      const target = state.legalTargets.find(t => t.row === r && t.col === c);
      if (target) {
        sq.classList.add(target.capture ? 'sq-capture' : 'sq-target');
      }

      sq.addEventListener('click', () => onSquareClick(r, c));
      boardEl.appendChild(sq);
    }
  }

  turnEl.textContent = state.turn === 'w' ? '⚪ Giliran Putih' : '⚫ Giliran Hitam';
  turnEl.style.color = state.turn === 'w' ? '#eee' : '#ff6a3d';

  if (state.status === 'checkmate') {
    const winner = state.turn === 'w' ? 'Hitam' : 'Putih';
    statusEl.textContent = `♛ Skakmat! ${winner} menang!`;
    statusEl.className = 'status-text status-over';
  } else if (state.status === 'stalemate') {
    statusEl.textContent = '🤝 Seri (Stalemate)';
    statusEl.className = 'status-text status-over';
  } else if (state.status === 'check') {
    statusEl.textContent = '⚠️ Skak!';
    statusEl.className = 'status-text status-check';
  } else {
    statusEl.textContent = 'Silakan jalan';
    statusEl.className = 'status-text';
  }

  capturedWEl.textContent = state.captured.w.map(p => UNICODE[p]).join(' ');
  capturedBEl.textContent = state.captured.b.map(p => UNICODE[p]).join(' ');
}

function onSquareClick(row, col) {
  if (state.status === 'checkmate' || state.status === 'stalemate') return;
  const piece = state.board[row][col];

  if (state.selected) {
    const target = state.legalTargets.find(t => t.row === row && t.col === col);
    if (target) {
      makeMove(state.selected, target);
      return;
    }
    // Klik bidak lain milik sendiri -> ganti seleksi
    if (piece && pieceColor(piece) === state.turn) {
      selectSquare(row, col);
    } else {
      state.selected = null;
      state.legalTargets = [];
      render();
    }
    return;
  }

  if (piece && pieceColor(piece) === state.turn) {
    selectSquare(row, col);
  }
}

function selectSquare(row, col) {
  state.selected = { row, col };
  state.legalTargets = legalMoves(state, row, col);
  render();
}

function makeMove(from, move) {
  if (move.promote) {
    pendingPromotion = { from, move };
    promoModal.classList.add('show');
    return;
  }
  finalizeMove(from, move);
}

function finalizeMove(from, move) {
  const piece = state.board[from.row][from.col];
  const color = pieceColor(piece);
  const result = applyMove(state, from, move);

  state.board = result.board;
  state.castling = result.castling;
  state.enPassant = result.enPassant;

  if (result.captured) {
    state.captured[color].push(result.captured);
  }

  state.selected = null;
  state.legalTargets = [];
  state.turn = color === 'w' ? 'b' : 'w';

  const inCheck = isInCheck(state.board, state.turn);
  const hasMoves = allLegalMoves(state, state.turn).length > 0;

  if (inCheck && !hasMoves) state.status = 'checkmate';
  else if (!inCheck && !hasMoves) state.status = 'stalemate';
  else if (inCheck) state.status = 'check';
  else state.status = 'playing';

  render();
}

function choosePromotion(pieceLetter) {
  if (!pendingPromotion) return;
  const { from, move } = pendingPromotion;
  move.promoteTo = pieceLetter;
  pendingPromotion = null;
  promoModal.classList.remove('show');
  finalizeMove(from, move);
}

document.querySelectorAll('.promo-choice').forEach(btn => {
  btn.addEventListener('click', () => choosePromotion(btn.dataset.piece));
});

resetBtn.addEventListener('click', () => newGame());

newGame();

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

function startMusic() {
  const music = document.getElementById("bgMusic");
  music.play().catch(err => console.log(err));
}

// ===== THEME TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement; // atau document.body
    
    // Cek localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Default light
        htmlElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? '🌙' : '☀️';
        themeToggle.textContent = icon;
    }
});

// ===== MUSIC CONTROL =====
document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    // Cek apakah musik sudah autoplay
    if (bgMusic && !bgMusic.paused) {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.btn-icon').textContent = '🔊';
        musicBtn.querySelector('.btn-text').textContent = 'Musik Diputar';
    }
    
    musicBtn.addEventListener('click', function() {
        if (!bgMusic) return;
        
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.btn-icon').textContent = '🎵';
            musicBtn.querySelector('.btn-text').textContent = 'Putar Musik';
        } else {
            bgMusic.play().catch(err => {
                console.log('Autoplay diblokir, butuh interaksi user');
            });
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.btn-icon').textContent = '🔊';
            musicBtn.querySelector('.btn-text').textContent = 'Musik Diputar';
        }
        isPlaying = !isPlaying;
    });
});

// Hapus function startMusic() yang lama