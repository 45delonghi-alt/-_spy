import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { contentStart, isChapterStart, Scene } from "../data/chapters";
import { C, FONT, LAYOUT, MONO } from "../theme";
import { rise } from "../anim";
import { SpyHUD } from "./SpyHUD";
import { MissionIntro } from "./MissionIntro";
import { Captions } from "./Captions";
import { AgentDecisionPause } from "./AgentDecisionPause";

// 全シーン共通の枠：背景グリッド・HUD・見出し（キーメッセージ）・字幕・章扉・停止カード
export const SceneFrame: React.FC<{
  scene: Scene;
  dark?: boolean;
  hideHeadline?: boolean;
  label?: string;
  children: React.ReactNode;
}> = ({ scene, dark, hideHeadline, label, children }) => {
  const frame = useCurrentFrame();
  const t0 = contentStart(scene);
  return (
    <AbsoluteFill style={{ background: dark ? C.dark : C.bg, fontFamily: FONT, color: dark ? "#fff" : C.text, overflow: "hidden" }}>
      <Grid dark={dark} />
      {/* 赤いスラッシュ（原稿デザインの継承） */}
      {!hideHeadline && <div style={{ position: "absolute", left: 52, top: LAYOUT.headlineTop + 4, width: 12, height: 64, background: C.red, transform: "skewX(-20deg)" }} />}
      {!hideHeadline && (
        <div style={{ position: "absolute", left: 92, top: LAYOUT.headlineTop, right: 120, ...rise(frame, t0 + 0.1) }}>
          {label && (
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: C.red, fontWeight: 700, marginBottom: 2 }}>{label}</div>
          )}
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 1, lineHeight: 1.2 }}>{scene.keyMessage}</div>
        </div>
      )}
      {children}
      {scene.pause && <AgentDecisionPause pause={scene.pause} />}
      <Captions scene={scene} />
      <SpyHUD chapter={scene.chapter} />
      {isChapterStart(scene) && scene.id !== 1 && <MissionIntro chapter={scene.chapter} />}
    </AbsoluteFill>
  );
};

const Grid: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.05)" : "rgba(20,42,67,0.045)"} 1px, transparent 1px), linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.05)" : "rgba(20,42,67,0.045)"} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
      backgroundPosition: "0 24px",
    }}
  />
);
