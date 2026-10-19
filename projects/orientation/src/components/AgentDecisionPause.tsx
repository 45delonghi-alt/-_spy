import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PausePoint } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { blink, pop, prog } from "../anim";

// AGENT DECISION：進行者が動画を止める目印。MP4単体では自動停止しない（facilitator_timecodes.csv 参照）。
export const AgentDecisionPause: React.FC<{ pause: PausePoint }> = ({ pause }) => {
  const frame = useCurrentFrame();
  const at = pause.atSeconds;
  const bg = prog(frame, at, 0.4);
  if (bg <= 0) return null;
  const card = pop(frame, at + 0.15);
  return (
    <AbsoluteFill style={{ background: `rgba(6,14,25,${0.72 * bg})`, zIndex: 30, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 196,
          width: 1400,
          height: 620,
          background: C.dark,
          border: `3px solid ${C.red}`,
          borderRadius: 10,
          boxSizing: "border-box",
          padding: "52px 80px",
          color: "#fff",
          transform: `scale(${0.9 + card * 0.1})`,
          opacity: card,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: C.red, fontWeight: 700 }}>
            AGENT DECISION <span style={{ color: "#9FB3C8" }}>/ {pause.id}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "3px solid #fff",
              borderRadius: 40,
              padding: "8px 26px",
              opacity: 0.4 + 0.6 * blink(frame, 1.2),
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 9, height: 28, background: "#fff" }} />
              <div style={{ width: 9, height: 28, background: "#fff" }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>PAUSE POINT</span>
          </div>
        </div>
        <div style={{ fontSize: 40, color: "#B9C8D8", marginTop: 40 }}>あなたならどう考える？</div>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.35, marginTop: 18 }}>{pause.question}</div>
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 52,
            borderTop: `2px solid ${C.hudLine}`,
            paddingTop: 26,
            fontSize: 34,
            color: "#DDE6EF",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>⏸ {pause.guide}</span>
          <span style={{ fontFamily: MONO, fontSize: 24, color: "#6E86A0", alignSelf: "center" }}>進行者：ここで一時停止</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
