import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { pop, prog } from "../anim";
import { IconLock } from "./Icons";

// 証拠カード：タグ付きのカードがポップインし、取得スタンプが押される
export const EvidenceCard: React.FC<{
  at: number;
  no: string;
  title: string;
  sub?: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  highlight?: boolean;
}> = ({ at, no, title, sub, icon, x, y, w, h, highlight }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  const stamp = prog(frame, at + 0.5, 0.25);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#fff",
        border: `2px solid ${highlight ? C.red : C.line}`,
        borderRadius: 10,
        boxShadow: "0 10px 30px rgba(20,42,67,0.12)",
        boxSizing: "border-box",
        padding: "22px 26px",
        opacity: Math.min(1, s * 1.4),
        transform: `scale(${0.85 + 0.15 * s})`,
        display: "flex",
        gap: 22,
        alignItems: "center",
        fontFamily: FONT,
        color: C.text,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, background: C.text, color: "#fff", fontFamily: MONO, fontSize: 17, letterSpacing: 2, padding: "3px 12px", borderRadius: "8px 0 8px 0" }}>
        EVIDENCE {no}
      </div>
      <div style={{ color: C.text, flexShrink: 0, marginTop: 10 }}>{icon}</div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.25 }}>{title}</div>
        {sub && <div style={{ fontSize: 26, color: "#4A6079", marginTop: 6, lineHeight: 1.35, whiteSpace: "pre-line" }}>{sub}</div>}
      </div>
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 12,
          border: `3px solid ${C.red}`,
          color: C.red,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 2,
          padding: "2px 8px",
          transform: `rotate(-8deg) scale(${1.6 - stamp * 0.6})`,
          opacity: stamp,
        }}
      >
        COLLECTED
      </div>
    </div>
  );
};

// ファイル解除：鍵付きフォルダが開き、タイトルが現れる
export const FileUnlock: React.FC<{ at: number; no: string; title: string; sub?: string; x: number; y: number; w?: number; h?: number }> = ({
  at,
  no,
  title,
  sub,
  x,
  y,
  w = 460,
  h = 400,
}) => {
  const frame = useCurrentFrame();
  const appear = pop(frame, at - 0.6);
  const open = prog(frame, at, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, appear * 1.5), transform: `translateY(${(1 - appear) * 30}px)` }}>
      {/* フォルダのタブ */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 190, height: 44, background: open > 0.5 ? C.red : C.text, borderRadius: "10px 10px 0 0", color: "#fff", fontFamily: MONO, fontSize: 22, letterSpacing: 3, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
        FILE {no}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 42,
          width: w,
          height: h - 42,
          background: open > 0.5 ? "#fff" : C.sub,
          border: `3px solid ${open > 0.5 ? C.red : C.text}`,
          borderRadius: "0 10px 10px 10px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          color: C.text,
          gap: 16,
        }}
      >
        <IconLock size={78} color={open > 0.5 ? C.red : C.text} stroke={3.5} open={open} />
        <div style={{ fontSize: 46, fontWeight: 900, opacity: 0.25 + 0.75 * open }}>{title}</div>
        {sub && <div style={{ fontSize: 26, color: "#4A6079", opacity: open }}>{sub}</div>}
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: open > 0.5 ? C.ok : C.gray }}>{open > 0.5 ? "UNLOCKED" : "LOCKED"}</div>
      </div>
    </div>
  );
};

// スタンプ
export const Stamp: React.FC<{ at: number; text: string; x: number; y: number; size?: number; color?: string; rotate?: number }> = ({
  at,
  text,
  x,
  y,
  size = 44,
  color = C.red,
  rotate = -8,
}) => {
  const frame = useCurrentFrame();
  const s = prog(frame, at, 0.25);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        border: `5px solid ${color}`,
        color,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 4,
        padding: "6px 22px",
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${1.8 - 0.8 * s})`,
        opacity: s,
        background: "rgba(255,255,255,0.85)",
        whiteSpace: "nowrap",
        zIndex: 20,
      }}
    >
      {text}
    </div>
  );
};

// 小さな注記（制作案・架空例などの明示）
export const Note: React.FC<{ children: React.ReactNode; x?: number; y?: number; dark?: boolean }> = ({ children, x = 92, y = 822, dark }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontSize: 22, color: dark ? "#8DA2B8" : "#6B7F94", whiteSpace: "pre-line" }}>{children}</div>
);

// HUD風ラベル
export const HudTag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.red, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color, fontWeight: 700, ...style }}>{children}</div>
);

// 捜査線（赤い糸）：from→to をアニメーションで引く
export const Thread: React.FC<{ at: number; x1: number; y1: number; x2: number; y2: number; dur?: number; color?: string; width?: number; dashed?: boolean }> = ({
  at,
  x1,
  y1,
  x2,
  y2,
  dur = 0.6,
  color = C.red,
  width = 5,
  dashed,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "12 10" : `${len} ${len}`}
        strokeDashoffset={dashed ? 0 : len * (1 - p)}
        opacity={dashed ? p : 1}
      />
    </svg>
  );
};
