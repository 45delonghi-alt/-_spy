import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, Scene, sentenceAt } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { linear, pop, prog, rise } from "../anim";
import { SceneFrame } from "../components/SceneFrame";
import { HudTag, Note, Stamp } from "../components/Kit";
import { MissionComplete } from "../components/MissionComplete";
import { Scanlines } from "../components/MissionIntro";
import { IconBulb, IconChat, IconEar, IconGear, IconHandshake, IconLock, IconMemo, IconPerson, IconSearch } from "../components/Icons";

// SC11 AGENT SKILLS：3つの力のベン図（P10の3円を継承、ラベルは制作上の仮説モデル）
export const Scene11: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s1 = sentenceAt(scene, 1);
  const s2 = sentenceAt(scene, 2);
  const cx = 640;
  const cy = 520;
  const r = 165;
  const circles = [
    { label: "技術を理解する力", I: IconGear, dx: -100, dy: -75, at: s1 + 1.2, lx: 100, ly: 330, align: "right" as const },
    { label: "課題を考える力", I: IconSearch, dx: 100, dy: -75, at: s1 + 3.4, lx: 920, ly: 330, align: "left" as const },
    { label: "信頼関係を築く力", I: IconHandshake, dx: 0, dy: 100, at: s1 + 6.0, lx: 900, ly: 680, align: "left" as const },
  ];
  const core = prog(frame, s2, 0.6);
  return (
    <SceneFrame scene={scene} label="AGENT SKILLS ANALYSIS">
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {circles.map((c, i) => {
          const p = prog(frame, c.at, 0.8);
          const len = 2 * Math.PI * r;
          return (
            <circle
              key={i}
              cx={cx + c.dx}
              cy={cy + c.dy}
              r={r}
              fill={`rgba(20,42,67,${0.07 * p})`}
              stroke={C.text}
              strokeWidth={4}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
            />
          );
        })}
        <circle cx={cx} cy={cy - 10} r={56 * core} fill={C.red} opacity={0.9} />
        <line x1={cx + 30} y1={cy - 10} x2={interpolate(core, [0, 1], [cx + 30, 1230])} y2={cy - 10} stroke={C.red} strokeWidth={4} />
      </svg>
      {circles.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: c.lx, top: c.ly, width: 270, textAlign: c.align, ...rise(frame, c.at + 0.4) }}>
          <c.I size={60} color={C.text} />
          <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.3 }}>{c.label}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 1250, top: cy - 120, width: 600, opacity: core }}>
        <HudTag>CORE VALUE</HudTag>
        <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.35, marginTop: 8 }}>
          掛け合わせが、
          <br />
          センサ営業としての価値
        </div>
        <div style={{ fontSize: 28, color: "#4A6079", marginTop: 16 }}>一つだけでなく、重なりに価値がある</div>
      </div>
      <Note x={1250} y={780}>{"※3つの力のラベルは制作上の仮説モデル\n（正式文言は確認中）"}</Note>
    </SceneFrame>
  );
};

// SC12 能力が積み上がるキャリアの成長マップ
export const Scene12: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const steps = [
    { lv: "LEVEL 1", t: "技術を知る", I: IconGear },
    { lv: "LEVEL 2", t: "課題を考える", I: IconSearch },
    { lv: "LEVEL 3", t: "信頼を築く", I: IconHandshake },
    { lv: "CAREER", t: "将来の財産", I: IconBulb },
  ];
  const pos = (i: number) => ({ x: 230 + i * 480, y: 690 - i * 120 });
  const walk = linear(frame, 0.8, 7);
  const idx = walk * 3;
  const i0 = Math.min(2, Math.floor(idx));
  const f = idx - i0;
  const ax = interpolate(f, [0, 1], [pos(i0).x, pos(i0 + 1).x]);
  const ay = interpolate(f, [0, 1], [pos(i0).y, pos(i0 + 1).y]);
  return (
    <SceneFrame scene={scene} label="GROWTH MAP">
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {steps.slice(1).map((_, i) => (
          <line key={i} x1={pos(i).x} y1={pos(i).y} x2={pos(i + 1).x} y2={pos(i + 1).y} stroke={C.line} strokeWidth={10} strokeDasharray="4 18" strokeLinecap="round" />
        ))}
        <polyline
          points={[0, 1, 2, 3].filter((i) => i <= i0).map((i) => `${pos(i).x},${pos(i).y}`).concat(`${ax},${ay}`).join(" ")}
          fill="none"
          stroke={C.red}
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
      {steps.map((s, i) => {
        const p = pos(i);
        const reached = idx >= i - 0.02;
        return (
          <div key={s.lv} style={{ position: "absolute", left: p.x - 150, top: p.y - 65, width: 300, textAlign: "center", fontFamily: FONT, opacity: prog(frame, 0.2 + i * 0.2) }}>
            <div style={{ width: 130, height: 130, margin: "0 auto", borderRadius: 65, background: reached ? (i === 3 ? C.red : C.text) : "#fff", border: `4px solid ${i === 3 ? C.red : C.text}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${reached ? 1 + 0.08 * Math.max(0, 1 - Math.abs(idx - i) * 3) : 0.9})` }}>
              <s.I size={74} color={reached ? "#fff" : C.text} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.red, letterSpacing: 2, marginTop: 10, fontWeight: 700 }}>{s.lv}</div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>{s.t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: ax - 22, top: ay - 22, width: 44, height: 44, borderRadius: 22, background: C.red, border: "5px solid #fff", boxShadow: "0 0 0 4px rgba(220,9,36,0.35)" }} />
    </SceneFrame>
  );
};

// SC13 最終証拠開示：センサ営業 ≠ / ＝（P11の空欄を制作案で補完）
export const Scene13: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s1 = sentenceAt(scene, 1);
  const s2 = sentenceAt(scene, 2);
  const strike = prog(frame, s1 + 2.6, 0.5);
  const reveal = linear(frame, s2 + 0.3, 1.2);
  return (
    <SceneFrame scene={scene} label="DECLASSIFIED / 最終証拠">
      <div style={{ position: "absolute", left: 160, top: 290, width: 1600, ...rise(frame, s1 - 0.2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ fontSize: 52, fontWeight: 900, width: 360 }}>センサ営業 ≠</div>
          <div style={{ position: "relative", fontSize: 52, fontWeight: 700, color: "#4A6079" }}>
            商品を一方的に売り込むこと
            <div style={{ position: "absolute", left: -10, top: "54%", height: 8, background: C.red, width: `${strike * 106}%` }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 430, width: 1680, height: 340, background: C.sub, border: `3px solid ${C.text}`, borderRadius: 10, boxSizing: "border-box", padding: "44px 40px", opacity: prog(frame, s2 - 0.6) }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 36 }}>
          <div style={{ fontSize: 52, fontWeight: 900, width: 360, flexShrink: 0, marginTop: 20 }}>センサ営業 ＝</div>
          <div style={{ position: "relative", fontSize: 64, fontWeight: 900, lineHeight: 1.4, color: C.text }}>
            お客様が本当に困っていることを知り、
            <br />
            <span style={{ color: C.red }}>共に解決する仕事</span>
            {/* 黒塗り（機密）が剥がれる */}
            <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `${(1 - reveal) * 100}%`, background: C.darker }} />
          </div>
        </div>
      </div>
      <Stamp at={s2 + 1.7} text="DECLASSIFIED" x={1640} y={432} size={34} color={C.ok} />
      <Note>※原稿P11の空欄を補完した制作案</Note>
    </SceneFrame>
  );
};

// SC14 3カット（相手が話す／メモ／現場確認）→ AGENT DECISION Q02
export const Scene14: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cuts = [
    { t: "お客様が話す", I: IconChat },
    { t: "営業がメモする", I: IconMemo },
    { t: "現場で確かめる", I: IconSearch },
  ];
  return (
    <SceneFrame scene={scene} label="FIELD NOTES">
      {cuts.map((c, i) => (
        <div key={c.t} style={{ position: "absolute", left: 92 + i * 588, top: 300, width: 560, height: 460, border: `3px solid ${C.text}`, borderRadius: 10, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...rise(frame, 0.4 + i * 1.3) }}>
          <HudTag style={{ position: "absolute", left: 22, top: 16 }}>CUT {i + 1}</HudTag>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <IconPerson size={130} color={C.text} />
            <c.I size={110} color={C.red} />
          </div>
          <div style={{ fontSize: 42, fontWeight: 900 }}>{c.t}</div>
        </div>
      ))}
    </SceneFrame>
  );
};

// SC15 FINAL ORDER：P12の趣旨＋聞く→確かめる→提案する
export const Scene15: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s1 = sentenceAt(scene, 1);
  const s2 = sentenceAt(scene, 2);
  const steps = [
    { t: "聞く", s: "お客様の困りごとを聞く", I: IconEar },
    { t: "確かめる", s: "現場の条件・真因を確かめる", I: IconSearch },
    { t: "提案する", s: "解決策を一緒に考え、提案する", I: IconBulb },
  ];
  return (
    <SceneFrame scene={scene} label="FINAL ORDER">
      <div style={{ position: "absolute", left: 160, right: 160, top: 268, padding: "26px 48px", borderLeft: `8px solid ${C.red}`, background: C.sub, ...rise(frame, s1 - 0.3) }}>
        <HudTag>ORDER FROM MISSION CONTROL</HudTag>
        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.55, marginTop: 6 }}>
          「今日はぜひ、センサがどのように社会や製造現場を支えているか、という視点で仕事体験をしていただければと思います。」
        </div>
      </div>
      {steps.map((st, i) => (
        <React.Fragment key={st.t}>
          <div style={{ position: "absolute", left: 160 + i * 560, top: 520, width: 480, height: 290, background: "#fff", border: `3px solid ${C.text}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${pop(frame, s2 + i * 0.8)})` }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.red, letterSpacing: 3, fontWeight: 700 }}>STEP {i + 1}</div>
            <st.I size={84} color={C.text} />
            <div style={{ fontSize: 50, fontWeight: 900 }}>{st.t}</div>
            <div style={{ fontSize: 26, color: "#4A6079" }}>{st.s}</div>
          </div>
          {i < 2 && <div style={{ position: "absolute", left: 160 + i * 560 + 490, top: 630, fontSize: 56, color: C.red, opacity: prog(frame, s2 + i * 0.8 + 0.4) }}>▶</div>}
        </React.Fragment>
      ))}
      <Note>※原稿P12の文言を引用</Note>
    </SceneFrame>
  );
};

// SC16 MISSION CLEARED → NEXT MISSION UNLOCKED（最後2.5秒は静止）
export const Scene16: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const unlockAt = 6.4;
  const open = prog(frame, unlockAt, 0.4);
  const t = frame / FPS;
  return (
    <SceneFrame scene={scene} dark hideHeadline>
      <Scanlines opacity={0.2} />
      <MissionComplete at={0.3} y={170} sub="営業 ＝ お客様の課題の真因を捉え、ともに解決策を考える仕事" />
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 470,
          width: 1200,
          height: 300,
          border: `3px solid ${open > 0.5 ? C.red : C.hudLine}`,
          borderRadius: 12,
          background: "rgba(15,34,56,0.9)",
          display: "flex",
          alignItems: "center",
          gap: 40,
          padding: "0 60px",
          boxSizing: "border-box",
          fontFamily: FONT,
          ...rise(frame, unlockAt - 1),
        }}
      >
        <IconLock size={120} color={open > 0.5 ? C.red : "#9FB3C8"} stroke={3} open={open} />
        <div>
          <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: open > 0.5 ? "#FF6B7D" : "#9FB3C8" }}>
            {open > 0.5 ? "NEXT MISSION UNLOCKED" : "NEXT MISSION LOCKED"}
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", marginTop: 8, opacity: 0.3 + 0.7 * open }}>コンサルティング営業体験</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 30, color: "#B9C8D8", opacity: t > 9.5 ? 1 : 0 }}>
        オプテックス・エフエー株式会社 ／ 1日仕事体験
      </div>
    </SceneFrame>
  );
};
