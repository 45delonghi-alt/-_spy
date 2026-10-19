import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, NARRATION, Scene } from "../data/chapters";
import { FONT, LAYOUT } from "../theme";

const MAX_LINE = 24;

// 句読点の位置で1〜2行に分ける。長文は2ページに分割して時間を文字数比で按分。
const pagesOf = (text: string): string[] => {
  if (text.length <= MAX_LINE * 2) return [text];
  const mid = Math.floor(text.length / 2);
  const cut = nearestBreak(text, mid);
  return [text.slice(0, cut), text.slice(cut)];
};

const nearestBreak = (text: string, target: number) => {
  let best = target;
  let dist = Infinity;
  for (let i = 1; i < text.length - 1; i++) {
    if ("、，,".includes(text[i - 1]) && Math.abs(i - target) < dist) {
      best = i;
      dist = Math.abs(i - target);
    }
  }
  return best;
};

const linesOf = (page: string): string[] => {
  if (page.length <= MAX_LINE) return [page];
  const cut = nearestBreak(page, Math.ceil(page.length / 2));
  return [page.slice(0, cut), page.slice(cut)];
};

export type CaptionPage = { lines: string[]; start: number; end: number };

export const captionPages = (scene: Scene): CaptionPage[] => {
  const n = NARRATION[String(scene.id)];
  const out: CaptionPage[] = [];
  n.sentences.forEach((s) => {
    const pages = pagesOf(s.text);
    const total = pages.reduce((a, p) => a + p.length, 0);
    let t = s.start;
    pages.forEach((p) => {
      const d = ((s.end - s.start) * p.length) / total;
      out.push({ lines: linesOf(p), start: n.offset + t, end: n.offset + t + d });
      t += d;
    });
  });
  return out;
};

export const Captions: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const pages = captionPages(scene);
  // 文と文の間の無音では直前の字幕を残す
  const page = [...pages].reverse().find((p) => t >= p.start && t <= p.end + 0.35);
  if (!page) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: LAYOUT.captionTop,
        height: 170,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 45,
      }}
    >
      <div
        style={{
          background: "rgba(8,20,36,0.86)",
          color: "#fff",
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.5,
          padding: "14px 40px",
          borderRadius: 8,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {page.lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};
