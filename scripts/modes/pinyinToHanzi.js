import { loadVocab, shuffle, getRange, speakChinese } from "../utils.js";

const app = document.getElementById("app");
let data = [];
let idx = 0;

init();

async function init() {
  data = shuffle(await loadVocab(getRange()));
  idx = 0;
  render();
}

function render() {
  const q = data[idx];
  // 手書き用 Canvas は後日実装。今は4択選択式＋記述式切替の基本形
  const options = shuffle([q.hanzi, ...data.filter(x => x !== q).slice(0, 3).map(x => x.hanzi)]);
  app.innerHTML = `
    <div class="card">
      <h2>ピン音 → 漢字</h2>
      <p class="question">${q.pinyin}<button id="speak">🔊</button></p>
      ${options
        .map(hz => `<button class="opt">${hz}</button>`)
        .join("")}
      <p id="result"></p>
      <button id="next">次へ</button>
    </div>`;

  document.querySelectorAll(".opt").forEach(btn => {
    btn.onclick = () => {
      const isCorrect = btn.textContent === q.hanzi;
      document.getElementById("result").textContent = isCorrect
        ? `✅ 正解！意味：${q.meaning}`
        : `❌ 不正解（正: ${q.hanzi}｜${q.meaning}）`;
    };
  });
  document.getElementById("speak").onclick = () => speakChinese(q.hanzi);

  document.getElementById("next").onclick = () => {
    idx = (idx + 1) % data.length;
    render();
  };
}
