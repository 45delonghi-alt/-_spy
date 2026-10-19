// ナレーション音声を timeline.json から生成する（Open JTalk + HTS Voice "Mei"）。
// 文単位で合成 → 無音を挟んで連結し、字幕用の文ごとの開始/終了秒を manifest に書き出す。
// 外部音声（ナレーター収録・他TTS）に差し替える場合は public/assets/audio/scXX.wav を置き換え、
// `node scripts/generate-narration.mjs --manifest-only` で manifest のみ再計算する。
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const timeline = JSON.parse(readFileSync(join(root, "src/data/timeline.json"), "utf8"));
const outDir = join(root, "public/assets/audio");
const tmpDir = join(root, ".narration-tmp");
const voice = process.env.VOICE ?? join(root, "tools/voice/mei_normal.htsvoice");
const dict = process.env.JTALK_DIC ?? "/var/lib/mecab/dic/open-jtalk/naist-jdic";
const manifestOnly = process.argv.includes("--manifest-only");
const GAP = 0.28; // 文と文の間の無音（秒）
const TAIL = 0.6; // シーン末尾に残す余白（秒）
const END_HOLD = 2.5; // 最終シーンの静止フレーム（秒）

mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const duration = (file) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])
      .toString()
      .trim(),
  );

const split = (text) =>
  text
    .split("。")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s + "。");

const synth = (text, rate, file) => {
  const txt = file.replace(/\.wav$/, ".txt");
  writeFileSync(txt, text);
  execFileSync("open_jtalk", ["-x", dict, "-m", voice, "-r", String(rate), "-a", "0.55", "-jf", "1.1", "-ow", file, txt]);
};

const manifest = {};
const lastSceneId = timeline.scenes[timeline.scenes.length - 1].id;

for (const scene of timeline.scenes) {
  const chapter = timeline.chapters.find((c) => c.id === scene.chapter);
  const isChapterStart = chapter.start === scene.start;
  const offset = isChapterStart && scene.id !== 1 ? timeline.meta.chapterIntroSeconds : timeline.meta.narrationLeadSeconds;
  const window = scene.end - scene.start - offset - TAIL - (scene.id === lastSceneId ? END_HOLD : 0);
  const display = split(scene.narration);
  const spoken = split(scene.tts);
  if (display.length !== spoken.length) throw new Error(`scene ${scene.id}: 表示文とTTS文の文数が一致しません`);

  const id = String(scene.id).padStart(2, "0");
  const finalFile = join(outDir, `sc${id}.wav`);
  let rate = 1.0;
  let parts = [];

  if (!manifestOnly) {
    for (;;) {
      parts = spoken.map((s, i) => {
        const f = join(tmpDir, `sc${id}_${i}.wav`);
        synth(s, rate, f);
        return { file: f, dur: duration(f) };
      });
      const total = parts.reduce((a, p) => a + p.dur, 0) + GAP * (parts.length - 1);
      if (total <= window || rate >= 1.2) {
        if (total > window) console.warn(`WARN scene ${scene.id}: ${total.toFixed(2)}s > 枠 ${window.toFixed(2)}s`);
        break;
      }
      rate = Math.round((rate + 0.03) * 100) / 100;
    }
    // 連結（文の間に無音）
    const inputs = [];
    const filters = [];
    parts.forEach((p, i) => {
      inputs.push("-i", p.file);
      filters.push(`[${i * 2}:a]`);
      if (i < parts.length - 1) {
        inputs.push("-f", "lavfi", "-t", String(GAP), "-i", "anullsrc=r=48000:cl=mono");
        filters.push(`[${i * 2 + 1}:a]`);
      }
    });
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", ...inputs,
      "-filter_complex", `${filters.join("")}concat=n=${filters.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]`,
      "-map", "[out]", "-ac", "1", finalFile,
    ]);
  } else if (!existsSync(finalFile)) {
    throw new Error(`${finalFile} がありません`);
  }

  // 文ごとのタイミング（差し替え音声の場合は文字数比で按分）
  const total = duration(finalFile);
  let sentences;
  if (parts.length) {
    let t = 0;
    sentences = parts.map((p, i) => {
      const s = { text: display[i], start: +t.toFixed(3), end: +(t + p.dur).toFixed(3) };
      t += p.dur + GAP;
      return s;
    });
  } else {
    const chars = display.reduce((a, s) => a + s.length, 0);
    let t = 0;
    sentences = display.map((text) => {
      const d = (text.length / chars) * total;
      const s = { text, start: +t.toFixed(3), end: +(t + d).toFixed(3) };
      t += d;
      return s;
    });
  }
  manifest[scene.id] = {
    file: `assets/audio/sc${id}.wav`,
    offset,
    duration: +total.toFixed(3),
    window: +window.toFixed(3),
    rate,
    sentences,
  };
  console.log(`scene ${id}: ${total.toFixed(2)}s / 枠 ${window.toFixed(2)}s  rate=${rate}`);
}

writeFileSync(join(root, "src/data/narrationManifest.json"), JSON.stringify(manifest, null, 2) + "\n");
rmSync(tmpDir, { recursive: true, force: true });
console.log("wrote src/data/narrationManifest.json");
