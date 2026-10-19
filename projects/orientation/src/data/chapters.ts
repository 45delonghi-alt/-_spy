// 章・シーン・字幕・音声・停止ポイントの一元データ。
// 正本は timeline.json（台本）と narrationManifest.json（音声の実長・文タイミング、スクリプトで生成）。
import timeline from "./timeline.json";
import manifestJson from "./narrationManifest.json";

export type ChapterState = "done" | "current" | "locked";

export type Chapter = {
  id: number;
  missionTitle: string;
  informationTheme: string;
  legacyTitle: string;
  sourcePages: string;
  start: number;
  end: number;
};

export type PausePoint = { id: string; atSeconds: number; question: string; guide: string };

export type Scene = {
  id: number;
  chapter: number;
  start: number;
  end: number;
  title: string;
  sourcePage: string;
  spyDirection: string;
  keyMessage: string;
  narration: string;
  tts: string;
  pause?: PausePoint;
};

export type Sentence = { text: string; start: number; end: number };
export type NarrationEntry = {
  file: string;
  offset: number;
  duration: number;
  window: number;
  rate: number;
  sentences: Sentence[];
};

export const META = timeline.meta;
export const FPS = timeline.meta.fps;
export const CHAPTERS: Chapter[] = timeline.chapters;
export const SCENES: Scene[] = timeline.scenes as Scene[];
export const NARRATION = manifestJson as unknown as Record<string, NarrationEntry>;
export const TOTAL_SECONDS = SCENES[SCENES.length - 1].end;
export const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

export const sec = (s: number) => Math.round(s * FPS);

export const chapterOf = (scene: Scene) => CHAPTERS.find((c) => c.id === scene.chapter)!;

export const isChapterStart = (scene: Scene) => chapterOf(scene).start === scene.start;

// シーン内で本編アニメーションを始める秒（章扉がある場合はその後）
export const contentStart = (scene: Scene) =>
  isChapterStart(scene) && scene.id !== 1 ? META.chapterIntroSeconds : 0;

export const chapterState = (chapterId: number, currentChapter: number): ChapterState =>
  chapterId < currentChapter ? "done" : chapterId === currentChapter ? "current" : "locked";

// シーン相対秒：n番目の文が読み始められる時刻
export const sentenceAt = (scene: Scene, index: number) => {
  const n = NARRATION[String(scene.id)];
  const s = n.sentences[Math.min(index, n.sentences.length - 1)];
  return n.offset + s.start;
};
