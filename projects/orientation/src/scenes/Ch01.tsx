import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, Scene, sentenceAt } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { blink, linear, pop, prog, rise } from "../anim";
import { SceneFrame } from "../components/SceneFrame";
import { Scanlines } from "../components/MissionIntro";
import { HudTag, Stamp } from "../components/Kit";
import { IconBuilding, IconCheck, IconFactory, IconShop } from "../components/Icons";

// SC01 指令受信 → MISSION BRIEFING → タイトル（センサ検知ラインがタイトルを描く）
export const Scene01: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const brief = "あなたの任務は、社会を支える“見えない技術”と、その技術を届ける営業の真の役割を解き明かすこと。";
  const typed = Math.floor(linear(frame, 1.3, 2.6) * brief.length);
  const briefOut = prog(frame, 4.6, 0.5);
  const beam = linear(frame, 5.0, 1.4);
  return (
    <SceneFrame scene={scene} dark hideHeadline>
      <Scanlines opacity={0.25} />
      {/* 受信表示 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: frame < 0.9 * FPS ? blink(frame, 0.5) : 0 }}>
        <HudTag color="#9FB3C8" style={{ fontSize: 40, letterSpacing: 10 }}>
          INCOMING TRANSMISSION ...
        </HudTag>
      </div>
      {/* ブリーフィング */}
      <div style={{ position: "absolute", left: 220, right: 220, top: 250, opacity: prog(frame, 0.9, 0.3) * (1 - briefOut), transform: `translateY(${-briefOut * 40}px)` }}>
        <HudTag style={{ fontSize: 34, letterSpacing: 10 }}>MISSION BRIEFING</HudTag>
        <div style={{ fontSize: 96, fontWeight: 900, marginTop: 12, letterSpacing: 6 }}>極秘調査任務</div>
        <div style={{ marginTop: 40, fontSize: 44, lineHeight: 1.6, color: "#DDE6EF", minHeight: 220 }}>
          『{brief.slice(0, typed)}
          {typed < brief.length ? <span style={{ opacity: blink(frame, 0.5) }}>▍</span> : "』"}
        </div>
      </div>
      {/* タイトル */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: frame > 4.9 * FPS ? 1 : 0 }}>
        <HudTag color="#9FB3C8" style={{ fontSize: 26, letterSpacing: 8, opacity: prog(frame, 6.0) }}>
          1日仕事体験 ／ ORIENTATION & STRATEGIC BRIEFING
        </HudTag>
        <div style={{ position: "relative", display: "inline-block", marginTop: 30 }}>
          <div style={{ fontSize: 104, fontWeight: 900, letterSpacing: 6, clipPath: `inset(0 ${(1 - beam) * 100}% 0 0)` }}>見えない技術で、社会を動かす。</div>
          {/* 検知ビーム：送光側→受光側 */}
          <div style={{ position: "absolute", left: -120, right: -120, top: "112%", height: 4, background: `linear-gradient(90deg, ${C.red}, rgba(220,9,36,0.2))`, opacity: beam < 1 ? 1 : 0.35 }} />
          <div style={{ position: "absolute", left: `${beam * 100}%`, top: -20, bottom: "-20%", width: 6, background: C.red, boxShadow: "0 0 30px 10px rgba(220,9,36,0.5)", opacity: beam > 0 && beam < 1 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: -150, top: "112%", width: 24, height: 44, marginTop: -20, background: C.red, borderRadius: 4 }} />
          <div style={{ position: "absolute", right: -150, top: "112%", width: 24, height: 44, marginTop: -20, background: "#6E86A0", borderRadius: 4 }} />
        </div>
        <div style={{ marginTop: 60, fontSize: 40, fontWeight: 700, letterSpacing: 4, ...rise(frame, 7.2) }}>オプテックス・エフエー株式会社</div>
        <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 14, border: `2px solid ${C.ok}`, padding: "8px 26px", borderRadius: 30, ...rise(frame, 8.2) }}>
          <IconCheck size={30} color={C.ok} stroke={6} />
          <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: C.ok }}>参加登録完了 ： YOU</span>
        </div>
      </div>
    </SceneFrame>
  );
};

// SC02 現状確認＝現在地チェック → AGENT DECISION Q01
export const Scene02: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const a = sentenceAt(scene, 1);
  const b = sentenceAt(scene, 2);
  const icons = [IconBuilding, IconFactory, IconShop];
  const scanIdx = Math.floor(Math.max(0, frame / FPS - b) / 0.9) % 3;
  return (
    <SceneFrame scene={scene} label="STATUS CHECK / 現状確認">
      {/* 左：何社目？ */}
      <Panel x={92} y={270} w={830} h={520} at={a - 0.6} tag="CHECK 01" title="今日の仕事体験は、何社目？">
        <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 4, background: C.line }} />
        {[0, 1, 2].map((i) => {
          const at = a + 0.3 + i * 0.4;
          const isYou = i === 2;
          return (
            <div key={i} style={{ position: "absolute", left: 90 + i * 300, top: 270, width: 64, textAlign: "center", opacity: prog(frame, at, 0.3) }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, border: `5px solid ${isYou ? C.red : C.text}`, background: isYou ? "#fff" : C.text, boxSizing: "border-box" }} />
              <div style={{ fontSize: 28, marginTop: 14, whiteSpace: "nowrap", marginLeft: -40, width: 144, fontWeight: isYou ? 900 : 400, color: isYou ? C.red : C.text }}>
                {isYou ? "今日" : `${i + 1}社目?`}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 640, top: 150, textAlign: "center", opacity: prog(frame, a + 1.4), transform: `translateY(${Math.sin(frame / 8) * 6}px)` }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.red, letterSpacing: 2, fontWeight: 700 }}>YOU ARE HERE</div>
          <div style={{ fontSize: 40, color: C.red, lineHeight: 1 }}>▼</div>
        </div>
      </Panel>
      {/* 右：興味のある業界 */}
      <Panel x={998} y={270} w={830} h={520} at={b - 0.6} tag="CHECK 02" title="興味を持ってきた業界は？">
        {icons.map((Ic, i) => {
          const active = frame / FPS > b && scanIdx === i;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 70 + i * 240,
                top: 190,
                width: 200,
                height: 200,
                border: `3px solid ${active ? C.red : C.line}`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: prog(frame, b + i * 0.25, 0.3),
              }}
            >
              <Ic size={120} color={active ? C.red : C.text} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 70, right: 70, top: 420, fontSize: 28, color: "#4A6079", textAlign: "center", opacity: prog(frame, b + 1) }}>
          メーカー？ 商社？ サービス？ ── あなたの関心を思い出そう
        </div>
      </Panel>
    </SceneFrame>
  );
};

// SC03 営業への思い込みを「仮説ファイル」として登録（P3の円構造を継承）
export const Scene03: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const a = sentenceAt(scene, 1);
  const c = sentenceAt(scene, 3);
  const cx = 560;
  const cy = 515;
  const sats = [
    { t: "売る", x: cx - 290, y: cy - 150 },
    { t: "ノルマ", x: cx + 290, y: cy - 150 },
    { t: "話す", x: cx, y: cy + 205 },
  ];
  const alt = ["聞く", "考える", "解決する"];
  return (
    <SceneFrame scene={scene} label="HYPOTHESIS FILE #001">
      {/* 仮説ファイルの台紙 */}
      <div style={{ position: "absolute", left: 92, top: 270, width: 940, height: 560, background: C.sub, border: `2px solid ${C.line}`, borderRadius: 10, opacity: prog(frame, 0.3) }}>
        <HudTag style={{ position: "absolute", left: 24, bottom: 16 }}>仮説：営業のイメージ</HudTag>
      </div>
      {sats.map((s, i) => (
        <svg key={`l${i}`} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={C.text} strokeWidth={3} opacity={prog(frame, a + i * 0.5)} />
        </svg>
      ))}
      <div style={{ position: "absolute", left: cx - 140, top: cy - 140, width: 280, height: 280, borderRadius: 140, border: `4px solid ${C.text}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 30, fontWeight: 700, lineHeight: 1.45, opacity: prog(frame, 0.5) }}>
        営業と聞いて
        <br />
        思い浮かぶ
        <br />
        イメージは？
      </div>
      {sats.map((s, i) => {
        const p = pop(frame, a + i * 0.5);
        return (
          <div key={s.t} style={{ position: "absolute", left: s.x - 95, top: s.y - 95, width: 190, height: 190, borderRadius: 95, background: C.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900, transform: `scale(${p})` }}>
            {s.t}
          </div>
        );
      })}
      <Stamp at={a + 2.2} text="UNVERIFIED / 未検証" x={880} y={780} size={28} />
      {/* 別の仮説 */}
      <div style={{ position: "absolute", left: 1110, top: 270, width: 718, height: 560, border: `3px dashed ${C.red}`, borderRadius: 10, boxSizing: "border-box", padding: "30px 40px", opacity: prog(frame, c - 0.4) }}>
        <HudTag>ALTERNATIVE HYPOTHESIS ?</HudTag>
        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>もしかすると、営業は…</div>
        {alt.map((t, i) => (
          <div key={t} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 22, ...rise(frame, c + 0.3 + i * 0.5) }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, border: `4px solid ${C.red}`, color: C.red, fontFamily: MONO, fontSize: 34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
            <div style={{ fontSize: 52, fontWeight: 900 }}>{t}</div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};

export const Panel: React.FC<{ x: number; y: number; w: number; h: number; at: number; tag: string; title: string; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  at,
  tag,
  title,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `2px solid ${C.line}`, borderTop: `6px solid ${C.text}`, background: "#fff", borderRadius: 6, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, fontFamily: FONT, boxSizing: "border-box" }}>
      <HudTag style={{ position: "absolute", left: 40, top: 26 }}>{tag}</HudTag>
      <div style={{ position: "absolute", left: 40, top: 60, fontSize: 40, fontWeight: 900 }}>{title}</div>
      {children}
    </div>
  );
};

