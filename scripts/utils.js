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

// 音声読み上げ（中国語）
export function speakChinese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN"; // 標準中国語（簡体字）
  utterance.rate = 1; // 読むスピード（0.1〜10）
  speechSynthesis.cancel(); // 前の発話を停止
  speechSynthesis.speak(utterance);
}