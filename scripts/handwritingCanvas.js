/**
 * handwritingCanvas.js
 * --------------------
 * Canvas に手書き → Google Handwriting API で候補を返す
 *
 * 使い方:
 *   import { attachHandwriting } from "../handwritingCanvas.js";
 *   attachHandwriting(parentElem, (cands) => {
 *       console.log(cands); // ["你","妳","呢", ...]
 *   });
 */
export function attachHandwriting(canvasParent, cb) {
    /* 1. Canvas 作成 */
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 280;
    canvas.style.border = "1px solid #888";
    canvasParent.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
  
    /* 2. ストローク収集 */
    const strokes = [];
    let currentStroke = null;
    let drawing = false;
  
    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return [t.clientX - r.left, t.clientY - r.top];
    }
  
    function start(e) {
      e.preventDefault();
      drawing = true;
      currentStroke = [[], []]; // xs[], ys[]
      const [x, y] = getPos(e);
      currentStroke[0].push(x);
      currentStroke[1].push(y);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const [x, y] = getPos(e);
      currentStroke[0].push(x);
      currentStroke[1].push(y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  
    function end() {
      if (!drawing) return;
      drawing = false;
      strokes.push(currentStroke);
    }
  
    ["mousedown", "touchstart"].forEach((ev) =>
      canvas.addEventListener(ev, start, { passive: false })
    );
    ["mousemove", "touchmove"].forEach((ev) =>
      canvas.addEventListener(ev, move, { passive: false })
    );
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((ev) =>
      canvas.addEventListener(ev, end)
    );
  
    /* 3. 操作ボタン */
    const btnWrap = document.createElement("div");
    btnWrap.style.marginTop = "0.5rem";
    canvasParent.appendChild(btnWrap);
  
    const recBtn = document.createElement("button");
    recBtn.textContent = "🔍 認識";
    btnWrap.appendChild(recBtn);
  
    const clrBtn = document.createElement("button");
    clrBtn.textContent = "🗑 クリア";
    btnWrap.appendChild(clrBtn);
  
    clrBtn.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.length = 0;
    };
  
    /* 4. Google Handwriting API 呼び出し */
    recBtn.onclick = async () => {
      if (!strokes.length) {
        alert("文字を書いてください");
        return;
      }
  
      try {
        const response = await fetch(
          "https://inputtools.google.com/request?itc=zh-t-i0-handwrit&app=translate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([0, strokes]),
          }
        );
        const res = await response.json();
  
        if (res[0] === "SUCCESS") {
          const candidates = res[1][0][1]; // ["你", "妳", ...]
          cb(candidates);
        } else {
          alert("認識に失敗しました");
        }
      } catch (err) {
        console.error(err);
        alert("ネットワークエラー");
      }
    };
  } // ← ★★ ここが “ファイルの最終行” ★★
  