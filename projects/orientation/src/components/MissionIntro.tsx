import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CHAPTERS, META, FPS } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { linear, prog } from "../anim";
import { IconLock } from "./Icons";

// 章扉：暗転 → ミッションカード → ファイル解除スキャン → 学習シーンへ（META.chapterIntroSeconds 秒）
export const MissionIntro: React.FC<{ chapter: number }> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const total = META.chapterIntroSeconds;
  if (frame > total * FPS) return null;
  const c = CHAPTERS.find((x) => x.id === chapter)!;

  const cardIn = prog(frame, 0.15, 0.4);
  const scan = linear(frame, 0.7, 0.9);
  const granted = frame >= 1.6 * FPS;
  const out = linear(frame, total - 0.4, 0.4);
  const unlock = prog(frame, 1.5, 0.3);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${C.hud} 0%, ${C.darker} 70%)`,
        fontFamily: FONT,
        color: "#fff",
        zIndex: 40,
        clipPath: `inset(0 0 ${out * 100}% 0)`,
      }}
    >
      <Scanlines />
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 300,
          width: 1200,
          height: 480,
          border: `2px solid ${C.hudLine}`,
          background: "rgba(10,25,45,0.85)",
          opacity: cardIn,
          transform: `scale(${0.96 + cardIn * 0.04})`,
          boxSizing: "border-box",
          padding: "56px 72px",
          overflow: "hidden",
        }}
      >
        <Corner />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <IconLock size={46} color={granted ? C.ok : C.red} stroke={4} open={unlock} />
          <span style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: "#9FB3C8" }}>
            MISSION {String(chapter).padStart(2, "0")} / 06
          </span>
        </div>
        <div style={{ fontSize: 92, fontWeight: 900, marginTop: 30, letterSpacing: 4 }}>{c.missionTitle}</div>
        <div style={{ fontSize: 34, color: "#B9C8D8", marginTop: 14 }}>{c.informationTheme}</div>

        <div style={{ position: "absolute", left: 72, right: 72, bottom: 56 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: granted ? C.ok : "#9FB3C8", marginBottom: 12 }}>
            {granted ? "ACCESS GRANTED" : `DECRYPTING FILE ... ${Math.round(scan * 100)}%`}
          </div>
          <div style={{ height: 8, background: "#1C3350" }}>
            <div style={{ width: `${scan * 100}%`, height: "100%", background: granted ? C.ok : C.red }} />
          </div>
        </div>
        {/* スキャンビーム */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: interpolate(scan, [0, 1], [-40, 1240]),
            width: 6,
            background: C.red,
            boxShadow: `0 0 30px 8px rgba(220,9,36,0.55)`,
            opacity: scan > 0 && scan < 1 ? 1 : 0,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)",
      opacity,
      pointerEvents: "none",
    }}
  />
);

const CORNERS: { pos: React.CSSProperties; sides: ("Left" | "Right" | "Top" | "Bottom")[] }[] = [
  { pos: { left: 0, top: 0 }, sides: ["Left", "Top"] },
  { pos: { right: 0, top: 0 }, sides: ["Right", "Top"] },
  { pos: { left: 0, bottom: 0 }, sides: ["Left", "Bottom"] },
  { pos: { right: 0, bottom: 0 }, sides: ["Right", "Bottom"] },
];

const Corner = () => (
  <>
    {CORNERS.map((c, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 34,
          height: 34,
          ...c.pos,
          ...Object.fromEntries(c.sides.map((sd) => [`border${sd}`, `5px solid ${C.red}`])),
        }}
      />
    ))}
  </>
);
