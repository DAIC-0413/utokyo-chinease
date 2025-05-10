// 共通関数をまとめておく
export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// utils.js
export async function loadVocab(range = "lesson1") {
  const res = await fetch(`data/${range}.json`);
  if (!res.ok) throw new Error("語彙データの読み込みに失敗しました");
  return await res.json();
}


export function getRange() {
  // URL ?range=hsk1 優先 → sessionStorage から復元
  const urlRange = new URLSearchParams(location.search).get("range");
  return urlRange || sessionStorage.getItem("quizRange") || "lesson1";
}

let chineseVoice = null;

// 音声が読み込まれたときに取得
speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  chineseVoice = voices.find(v => v.lang.startsWith("zh")); // zh-CN, zh-TW など
};

export function speakChinese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN"; // 念のため指定

  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  utterance.rate = 1;
  speechSynthesis.cancel(); // 前回の発音を止める
  speechSynthesis.speak(utterance);
}
