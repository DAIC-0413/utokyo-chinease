// scripts/header.js

const header = document.getElementById("global-header");
header.innerHTML = `
  <nav class="nav-bar">
    <div class="nav-left">
      <a href="index.html" class="logo-link">
        <img src="assets/logo.png" alt="ロゴ" class="logo-img">
      </a>
    </div>
    <div class="nav-right">
      <select id="global-mode-select">
        <option disabled selected>モード選択</option>
        <option value="hanzi-to-pinyin.html">漢字 → ピン音</option>
        <option value="pinyin-to-hanzi.html">ピン音 → 漢字</option>
        <option value="hanzi-to-meaning.html">漢字 → 意味</option>
        <option value="meaning-to-hanzi.html">意味 → 漢字</option>
      </select>
    </div>
  </nav>
`;

document.getElementById("global-mode-select").addEventListener("change", e => {
  const range = sessionStorage.getItem("quizRange") || "lesson1";
  location.href = `${e.target.value}?range=${range}`;
});
