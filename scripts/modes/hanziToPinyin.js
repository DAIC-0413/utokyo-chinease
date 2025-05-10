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
  const options = shuffle([
    q.pinyin,
    ...data.filter(x => x !== q).slice(0, 3).map(x => x.pinyin)
  ]);
  app.innerHTML = `
    <div class="card">
      <h2>漢字 → ピン音</h2>
      <p class="question">${q.hanzi} <button id="speak">🔊</button></p>
      <div class="choices">
        ${options.map(py => `<button class="opt">${py}</button>`).join("")}
      </div>
      
      <p id="result"></p>
      <button id="next">次へ</button>
    </div>`;


    document.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        const isCorrect = btn.textContent === q.pinyin;
        document.getElementById("result").textContent = isCorrect
          ? `✅ 正解！意味：${q.meaning}`
          : `❌ 不正解（正: ${q.pinyin}｜${q.meaning}）`;
      };
    });

  
  document.getElementById("speak").onclick = () => speakChinese(q.hanzi);

  document.getElementById("next").onclick = () => {
    idx = (idx + 1) % data.length;
    render();
  };
}
