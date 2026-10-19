import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { pop, prog } from "../anim";

// MISSION CLEARED 演出（章内の達成表示・結末の両方で使用）
export const MissionComplete: React.FC<{ at: number; title?: string; sub?: string; y?: number; scale?: number }> = ({
  at,
  title = "MISSION CLEARED",
  sub,
  y = 300,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  const line = prog(frame, at + 0.2, 0.6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, transform: `scale(${scale})` }}>
      <div style={{ display: "inline-block", position: "relative", opacity: Math.min(1, s * 1.3), transform: `scale(${1.3 - 0.3 * s})` }}>
        <div style={{ fontFamily: MONO, fontSize: 96, fontWeight: 700, letterSpacing: 12, color: C.ok, textShadow: "0 0 30px rgba(63,179,127,0.45)" }}>{title}</div>
        <div style={{ height: 6, background: C.ok, width: `${line * 100}%`, margin: "10px auto 0" }} />
      </div>
      {sub && <div style={{ marginTop: 26, fontSize: 36, color: "#DDE6EF", opacity: line }}>{sub}</div>}
    </div>
  );
};
