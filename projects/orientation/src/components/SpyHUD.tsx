import React from "react";
import { useCurrentFrame } from "remotion";
import { CHAPTERS, chapterState } from "../data/chapters";
import { C, FONT, LAYOUT, MONO } from "../theme";
import { IconCheck, IconLock } from "./Icons";
import { blink } from "../anim";

// 上部常設HUD：MISSION CONTROL | CH 03 / 06 | ミッション名 ＋ 6ステップ進捗
// 表示は現在の章IDだけから決まるため、シーク位置に必ず追従する。
export const SpyHUD: React.FC<{ chapter: number }> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const current = CHAPTERS.find((c) => c.id === chapter)!;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: LAYOUT.width,
        height: LAYOUT.hudHeight,
        background: `linear-gradient(180deg, ${C.darker} 0%, ${C.hud} 100%)`,
        borderBottom: `2px solid ${C.hudLine}`,
        display: "flex",
        alignItems: "center",
        padding: "0 48px",
        boxSizing: "border-box",
        fontFamily: FONT,
        color: "#fff",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: C.red, opacity: blink(frame, 1.6) }} />
        <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#9FB3C8" }}>MISSION CONTROL</span>
      </div>
      <Sep />
      <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 2, fontWeight: 700 }}>
        CH {String(chapter).padStart(2, "0")} <span style={{ color: "#6E86A0" }}>/ 06</span>
      </span>
      <Sep />
      <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>{current.missionTitle}</span>

      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        {CHAPTERS.map((c) => {
          const st = chapterState(c.id, chapter);
          return (
            <div
              key={c.id}
              style={{
                width: 84,
                height: 54,
                borderRadius: 6,
                border: st === "current" ? `3px solid ${C.red}` : `2px solid ${C.hudLine}`,
                background: st === "current" ? "rgba(220,9,36,0.18)" : st === "done" ? "rgba(63,179,127,0.12)" : "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 20, color: st === "locked" ? "#5A7089" : "#fff", fontWeight: 700 }}>
                {String(c.id).padStart(2, "0")}
              </span>
              {st === "done" && <IconCheck size={24} color={C.ok} stroke={6} />}
              {st === "locked" && <IconLock size={22} color="#5A7089" stroke={5} />}
              {st === "current" && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.red }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Sep = () => <div style={{ width: 2, height: 34, background: C.hudLine, margin: "0 26px" }} />;
