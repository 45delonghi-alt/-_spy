// 各シーンの代表フレームを docs/frames/ に書き出す（レビュー用）
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const timeline = JSON.parse(readFileSync(join(root, "src/data/timeline.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "src/data/narrationManifest.json"), "utf8"));
const browserExecutable = process.env.REMOTION_BROWSER ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const outDir = resolve(root, process.argv[2] ?? "../../docs/frames");
mkdirSync(outDir, { recursive: true });

// 代表時刻：ナレーション終了直後（全要素が出揃った状態）＋章扉・停止カード
const shots = [];
for (const s of timeline.scenes) {
  const n = manifest[s.id];
  const local = Math.min(s.end - s.start - 0.4, n.offset + n.duration + 0.3);
  const t = s.pause ? s.start + s.pause.atSeconds - 0.6 : s.start + local;
  shots.push({ name: `sc${String(s.id).padStart(2, "0")}`, t });
  if (s.pause) shots.push({ name: `sc${String(s.id).padStart(2, "0")}_pause`, t: s.start + s.pause.atSeconds + 2 });
}
shots.push({ name: "ch02_intro", t: 55 + 1.3 });
shots.push({ name: "sc01_brief", t: 3.6 });
shots.push({ name: "sc05_map", t: 80 + 11 });
shots.push({ name: "sc08_mid", t: 165 + 19 });
const extra = process.argv.slice(3).map((x) => ({ name: `t${x.replace(".", "_")}`, t: Number(x) }));

const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Orientation", browserExecutable });
for (const s of extra.length ? extra : shots) {
  const frame = Math.round(s.t * timeline.meta.fps);
  await renderStill({ composition, serveUrl, frame, browserExecutable, output: join(outDir, `${s.name}.jpg`), imageFormat: "jpeg", jpegQuality: 85 });
  console.log(s.name, frame);
}
