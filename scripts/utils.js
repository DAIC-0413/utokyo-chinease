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

speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  chineseVoice = voices.find(v => v.lang.startsWith("zh"));
};

export function speakChinese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";

  if (chineseVoice) {
    utterance.voice = chineseVoice;
  } else {
    // ✅ 警告を表示
    alert(
      "中国語音声が使用できないようです。\n" +
      "iOS端末をご利用の場合は「設定 → アクセシビリティ → 読み上げコンテンツ → 声」で中国語の音声（例：Ting-Ting）を追加してください。"
      "パソコンからなら上手くいくよ"
    );
  }

  utterance.rate = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

