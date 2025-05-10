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
  const options = shuffle([q.hanzi, ...data.filter(x => x !== q).slice(0, 3).map(x => x.hanzi)]);
  app.innerHTML = `
    <div class="card centered">
      <h2>意味 → 漢字</h2>
      <p class="question">${q.meaning}</p>
      <div class="choices">
      ${options
        .map(hz => `<button class="opt">${hz}</button>`)
        .join("")}
      </div>
      <p id="result"></p>
      <button id="next">次へ</button>
      <p class="question">ヒント（音声） <button id="speak">🔊</button></p>
    </div>`;

    document.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        const isCorrect = btn.textContent === q.hanzi;
        document.getElementById("result").textContent = isCorrect
          ? `✅ 正解！ピン音：${q.pinyin}`
          : `❌ 不正解（正: ${q.hanzi}｜${q.pinyin}）`;
      };
    });
  document.getElementById("speak").onclick = () => speakChinese(q.hanzi);

  document.getElementById("next").onclick = () => {
    idx = (idx + 1) % data.length;
    render();
  };
}
