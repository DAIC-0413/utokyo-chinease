import { loadData } from "./data.js";
import * as hanziToPinyin from "./modes/hanziToPinyin.js";
import * as pinyinToHanzi from "./modes/pinyinToHanzi.js";
import * as hanziToMeaning from "./modes/hanziToMeaning.js";
import * as meaningToHanzi from "./modes/meaningToHanzi.js";

const modeModules = {
  hanziToPinyin,
  pinyinToHanzi,
  hanziToMeaning,
  meaningToHanzi,
};

document.querySelectorAll(".mode-list button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const mode = btn.dataset.mode;
    const range = document.getElementById("range").value;
    const vocab = await loadData(range);
    modeModules[mode].start(vocab); // 各モードの start() を呼び出す
  });
});
