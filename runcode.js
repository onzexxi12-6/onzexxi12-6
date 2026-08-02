const defaultCode = {
  html: `<article>
  <h1>Halo, dunia! 👋</h1>
  <p>Ubah kode di atas lalu tekan Jalankan.</p>
  <button id="message-button">Klik saya</button>
</article>`,
  css: `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  display: grid;
  min-height: 100vh;
  place-items: center;
  background: #f3f5ff;
}

article {
  padding: 32px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 12px 32px #cfd4ef;
  text-align: center;
}

h1 { color: #5546db; }
button { padding: 9px 14px; border: 0; border-radius: 8px; background: #5546db; color: white; cursor: pointer; }`,
  js: `document.querySelector("#message-button").addEventListener("click", () => {
  console.log("Tombol berhasil diklik.");
  alert("Bagus! JavaScript kamu berjalan.");
});`,
};

const code = { ...defaultCode };
const assets = new Map();
const languageInfo = {
  html: { label: "HTML", placeholder: "<h1>Halo dunia</h1>" },
  css: { label: "CSS", placeholder: "body { color: #333; }" },
  js: { label: "JavaScript", placeholder: "console.log(\x27Halo!\x27);" },
};
const logBridge = `(function () {
  const format = (value) => {
    if (typeof value === "string") return value;
    try {
      const result = JSON.stringify(value);
      return result === undefined ? String(value) : result;
    } catch {
      return String(value);
    }
  };
  const send = (level, values) => window.parent.postMessage({ type: "code-tester-log", level, values: values.map(format) }, "*");
  ["log", "info", "warn", "error"].forEach((level) => {
    const original = console[level];
    console[level] = (...values) => { send(level, values); original.apply(console, values); };
  });
  window.addEventListener("error", (event) => send("error", [event.message]));
  window.addEventListener("unhandledrejection", (event) => send("error", [event.reason]));
})();`;

const input = document.querySelector("#code-input");
const editorLabel = document.querySelector("#editor-label");
const tabs = document.querySelectorAll(".editor-tab[data-language]");
const preview = document.querySelector("#preview-frame");
const logOutput = document.querySelector("#log-output");
const assetList = document.querySelector("#asset-list");
const fileInput = document.querySelector("#file-input");
const status = document.querySelector("#status");
const runButton = document.querySelector("#run-button");
const resetButton = document.querySelector("#reset-button");
const clearButton = document.querySelector("#clear-button");
const saveButton = document.querySelector("#save-button");
const addFileButton = document.querySelector("#add-file-button");
const fullscreenButton = document.querySelector("#fullscreen-button");
const previewPanel = document.querySelector(".preview-panel");
let activeLanguage = "html";

function saveActiveCode() {
  code[activeLanguage] = input.value;
}

function setActiveLanguage(language, shouldSave = true) {
  if (shouldSave) saveActiveCode();
  activeLanguage = language;
  input.value = code[language];
  input.placeholder = languageInfo[language].placeholder;
  editorLabel.textContent = `Tulis kode ${languageInfo[language].label} di sini`;
  tabs.forEach((tab) => {
    const isActive = tab.dataset.language === language;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  input.focus();
}

function renderAssetList() {
  assetList.replaceChildren(...[...assets.keys()].map((name) => {
    const item = document.createElement("li");
    item.textContent = name;
    return item;
  }));
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function addAssets(files) {
  const mediaFiles = [...files].filter((file) => /^(image|audio|video)\//.test(file.type));
  if (!mediaFiles.length) return;
  const imported = await Promise.all(mediaFiles.map(async (file) => [file.name, { file, dataUrl: await readAsDataUrl(file) }]));
  imported.forEach(([name, asset]) => assets.set(name, asset));
  renderAssetList();
  status.textContent = `${mediaFiles.length} file ditambahkan`;
}

function escapeRegExp(value) {
  const specialCharacters = [92, 94, 36, 46, 42, 43, 63, 40, 41, 91, 93, 123, 125, 124].map(String.fromCharCode).join("");
  return [...value].map((character) => specialCharacters.includes(character) ? String.fromCharCode(92) + character : character).join("");
}

function resolveAssetReferences(source) {
  let result = source;
  assets.forEach(({ dataUrl }, name) => {
    result = result.replace(new RegExp(escapeRegExp(name), "g"), dataUrl);
  });
  return result;
}

function appendLog(level, values) {
  if (logOutput.textContent === "Log JavaScript akan tampil di sini." || logOutput.textContent === "Menjalankan kode...") {
    logOutput.textContent = "";
  }
  const message = `[${level.toUpperCase()}] ${values.join(" ")}`;
  logOutput.textContent += `${logOutput.textContent ? "\n" : ""}${message}`;
  logOutput.scrollTop = logOutput.scrollHeight;
}

function runCode() {
  saveActiveCode();
  logOutput.textContent = "Menjalankan kode...";
  const previewHtml = resolveAssetReferences(code.html);
  const previewCss = resolveAssetReferences(code.css);
  const safeJavaScript = resolveAssetReferences(code.js).replace(/<\/script/gi, "<\\/script");
  preview.srcdoc = `<!doctype html>
<html lang="id">
  <head><meta charset="UTF-8"><style>${previewCss}</style></head>
  <body>
    ${previewHtml}
    <script>${logBridge}<\/script>
    <script>${safeJavaScript}<\/script>
  </body>
</html>`;
  status.textContent = "Preview diperbarui";
}

function downloadFile(file, filename) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function saveProject() {
  saveActiveCode();
  const projectHtml = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Proyek Code Tester</title>
  </head>
  <body>
    ${code.html}
    <script src="script.js"><\/script>
  </body>
</html>`;
  downloadFile(new Blob([projectHtml], { type: "text/html" }), "index.html");
  downloadFile(new Blob([code.css], { type: "text/css" }), "style.css");
  downloadFile(new Blob([code.js], { type: "text/javascript" }), "script.js");
  assets.forEach(({ file }) => downloadFile(file, file.name));
  status.textContent = "File proyek disimpan";
}

runButton.addEventListener("click", runCode);
tabs.forEach((tab) => tab.addEventListener("click", () => setActiveLanguage(tab.dataset.language)));
addFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async () => {
  await addAssets(fileInput.files);
  fileInput.value = "";
});
saveButton.addEventListener("click", saveProject);

window.addEventListener("message", (event) => {
  if (event.source !== preview.contentWindow || event.data?.type !== "code-tester-log") return;
  appendLog(event.data.level, event.data.values);
});

fullscreenButton.addEventListener("click", async () => {
  if (document.fullscreenElement === previewPanel) await document.exitFullscreen();
  else await previewPanel.requestFullscreen();
});

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement === previewPanel;
  fullscreenButton.textContent = isFullscreen ? "Kecilkan ⛶" : "Perbesar ⛶";
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "Kecilkan preview" : "Perbesar preview");
});

clearButton.addEventListener("click", () => {
  Object.keys(code).forEach((language) => { code[language] = ""; });
  assets.clear();
  renderAssetList();
  setActiveLanguage("html", false);
  preview.srcdoc = "";
  logOutput.textContent = "Semua kode telah dihapus.";
  status.textContent = "Editor dikosongkan";
});

resetButton.addEventListener("click", () => {
  Object.assign(code, defaultCode);
  setActiveLanguage("html", false);
  runCode();
});

input.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
});

input.value = code.html;
runCode();

// CONTROL MUSIK/AUDIO
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