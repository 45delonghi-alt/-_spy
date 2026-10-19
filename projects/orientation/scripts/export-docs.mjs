// timeline.json / narrationManifest.json から納品用CSV・字幕(SRT)を書き出す。
// 台本や音声を差し替えたら `npm run docs` で再生成する。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "../../docs");
mkdirSync(docs, { recursive: true });
const tl = JSON.parse(readFileSync(join(root, "src/data/timeline.json"), "utf8"));
const mf = JSON.parse(readFileSync(join(root, "src/data/narrationManifest.json"), "utf8"));
const ch = (id) => tl.chapters.find((c) => c.id === id);

const tc = (s) => {
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, "0")}`;
};
const srtTime = (s) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};
const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (file, header, rows) => {
  // Excelで文字化けしないようBOM付きUTF-8
  writeFileSync(join(docs, file), "﻿" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\n") + "\n");
  console.log("wrote docs/" + file);
};

csv(
  "storyboard.csv",
  ["CH", "ミッション名", "SC", "開始", "終了", "場面", "原稿ページ", "スパイ演出", "画面キーメッセージ", "停止ポイント"],
  tl.scenes.map((s) => [
    String(s.chapter).padStart(2, "0"),
    ch(s.chapter).missionTitle,
    s.id,
    tc(s.start),
    tc(s.end),
    s.title,
    s.sourcePage,
    s.spyDirection,
    s.keyMessage,
    s.pause ? `${s.pause.id} ${tc(s.start + s.pause.atSeconds)}` : "",
  ]),
);

csv(
  "narration.csv",
  ["SC", "音声ファイル", "シーン内開始(秒)", "音声長(秒)", "使用可能枠(秒)", "話速", "ナレーション（字幕表記）", "読み上げ用テキスト"],
  tl.scenes.map((s) => {
    const n = mf[s.id];
    return [s.id, `public/${n.file}`, n.offset, n.duration, n.window, n.rate, s.narration, s.tts];
  }),
);

csv(
  "facilitator_timecodes.csv",
  ["ID", "カード表示開始", "推奨停止（ナレーション終了後）", "カード表示終了", "表示内容", "進行者の操作", "目安時間"],
  tl.scenes
    .filter((s) => s.pause)
    .map((s) => [
      s.pause.id,
      tc(s.start + s.pause.atSeconds),
      tc(s.start + mf[s.id].offset + mf[s.id].duration + 0.3),
      tc(s.end),
      s.pause.question,
      "ナレーション「動画を止めて…」の直後に一時停止→討議→再生",
      "30〜60秒",
    ]),
);

// 字幕（SRT）：画面と同じ文単位
let idx = 1;
const srt = [];
for (const s of tl.scenes) {
  const n = mf[s.id];
  for (const se of n.sentences) {
    srt.push(`${idx++}\n${srtTime(s.start + n.offset + se.start)} --> ${srtTime(s.start + n.offset + se.end + 0.2)}\n${se.text}\n`);
  }
}
writeFileSync(join(docs, "captions.srt"), srt.join("\n"));
console.log("wrote docs/captions.srt");
