import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, Scene, sentenceAt } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { linear, pop, prog, rise } from "../anim";
import { SceneFrame } from "../components/SceneFrame";
import { HudTag, Thread } from "../components/Kit";
import { IconAutoDoor, IconBottle, IconCar, IconCircuit, IconElevator, IconFactory, IconGear, IconParking, IconSensor, IconTarget } from "../components/Icons";

// SC04 生活の中に潜むセンサの痕跡をスキャン（検知の図解①）
export const Scene04: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const a = sentenceAt(scene, 1);
  const b = sentenceAt(scene, 2);
  const sweep = linear(frame, 2.7, 1.8);
  const traces = [
    { no: "01", label: "自動ドア", Icon: IconAutoDoor },
    { no: "02", label: "駐車場", Icon: IconParking },
    { no: "03", label: "建物の設備", Icon: IconElevator },
  ];
  const steps = [
    { t: "人・モノの存在", s: "を捉える（検知）" },
    { t: "信号に変える", s: "（検知した／しない）" },
    { t: "次の動作へ", s: "ドアが開く・照明が点く など" },
  ];
  return (
    <SceneFrame scene={scene} label="SCAN / 日常に潜む痕跡">
      {traces.map((tr, i) => {
        const at = a + i * 0.9;
        const x = 92 + i * 588;
        // 対象物が検知ビームを横切る周期アニメーション
        const cyc = ((t - at) % 3) / 3;
        const objX = interpolate(cyc, [0, 1], [30, 520]);
        const hit = t > at && objX > 250 && objX < 330;
        return (
          <div key={tr.no} style={{ position: "absolute", left: x, top: 270, width: 560, height: 330, background: "#fff", border: `2px solid ${hit ? C.red : C.line}`, borderRadius: 10, opacity: prog(frame, at - 0.3), overflow: "hidden" }}>
            <HudTag style={{ position: "absolute", left: 24, top: 18 }}>TRACE {tr.no}</HudTag>
            <div style={{ position: "absolute", left: 24, top: 48, fontSize: 40, fontWeight: 900 }}>{tr.label}</div>
            <div style={{ position: "absolute", right: 30, top: 30 }}>
              <tr.Icon size={110} color={C.text} />
            </div>
            {/* センサと検知ビーム */}
            <div style={{ position: "absolute", left: 270, top: 160, width: 40, height: 22, background: C.text, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 286, top: 182, width: 8, height: 118, background: hit ? C.red : "rgba(220,9,36,0.25)", boxShadow: hit ? "0 0 24px 6px rgba(220,9,36,0.45)" : "none" }} />
            <div style={{ position: "absolute", left: 20, right: 20, top: 300, height: 3, background: C.line }} />
            {t > at && <div style={{ position: "absolute", left: objX - 20, top: 248, width: 40, height: 52, borderRadius: "20px 20px 4px 4px", background: C.gray }} />}
            <div style={{ position: "absolute", left: 330, top: 200, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.red, opacity: hit ? 1 : 0, letterSpacing: 2 }}>DETECTED</div>
          </div>
        );
      })}
      {/* 検知の原理：捉える→信号→動作 */}
      <div style={{ position: "absolute", left: 92, top: 630, width: 1736, height: 190, background: C.sub, borderRadius: 10, opacity: prog(frame, b - 0.3) }}>
        <HudTag style={{ position: "absolute", left: 28, top: 16 }}>HOW IT WORKS</HudTag>
        {steps.map((s, i) => (
          <React.Fragment key={s.t}>
            <div style={{ position: "absolute", left: 120 + i * 560, top: 56, width: 420, textAlign: "center", ...rise(frame, b + i * 0.8) }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: i === 0 ? C.red : C.text }}>{s.t}</div>
              <div style={{ fontSize: 28, color: "#4A6079", marginTop: 6 }}>{s.s}</div>
            </div>
            {i < 2 && (
              <div style={{ position: "absolute", left: 560 + i * 560, top: 74, fontSize: 56, color: C.red, opacity: prog(frame, b + i * 0.8 + 0.4) }}>▶</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* スキャンライン */}
      <div style={{ position: "absolute", top: 250, height: 590, left: interpolate(sweep, [0, 1], [60, 1860]), width: 4, background: C.red, boxShadow: "0 0 30px 10px rgba(220,9,36,0.35)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
    </SceneFrame>
  );
};

// SC05 日常→工場の地図を展開し、FA調査地点を特定（検知の図解②：コンベヤでの検出）
export const Scene05: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fa = sentenceAt(scene, 1);
  const here = sentenceAt(scene, 3);
  const q = sentenceAt(scene, 4);
  const phaseB = here - 1.2;
  const mapOut = prog(frame, phaseB, 0.6);
  const factoryIn = prog(frame, phaseB + 0.3, 0.6);
  return (
    <SceneFrame scene={scene} label="MAP / 調査地点を特定">
      {/* フェーズA：日常 → 工場 */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - mapOut }}>
        <div style={{ position: "absolute", left: 140, top: 270, width: 460, height: 460, borderRadius: 230, border: `3px dashed ${C.gray}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 18, padding: 70, boxSizing: "border-box", opacity: prog(frame, 0.3) }}>
          <IconAutoDoor size={110} color={C.gray} />
          <IconParking size={110} color={C.gray} />
          <IconElevator size={110} color={C.gray} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 740, width: 460, textAlign: "center", fontSize: 34, fontWeight: 700, color: "#4A6079", opacity: prog(frame, 0.3) }}>日常のセンサ</div>
        <Thread at={1.2} x1={640} y1={530} x2={1250} y2={530} dur={1.2} color={C.text} width={14} />
        <div style={{ position: "absolute", left: 1232, top: 500, width: 0, height: 0, borderTop: "30px solid transparent", borderBottom: "30px solid transparent", borderLeft: `46px solid ${C.text}`, opacity: prog(frame, 2.2, 0.2) }} />
        <div style={{ position: "absolute", left: 640, width: 640, top: 420, textAlign: "center", ...rise(frame, fa) }}>
          <div style={{ fontSize: 46, fontWeight: 900 }}>FA（Factory Automation）</div>
        </div>
        <div style={{ position: "absolute", left: 600, width: 720, top: 575, textAlign: "center", ...rise(frame, fa + 0.6) }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.red }}>＝ 工場の自動化</div>
          <div style={{ fontSize: 26, color: "#4A6079", marginTop: 8, opacity: prog(frame, sentenceAt(scene, 2)) }}>製造工程を自動化し、安定したものづくりを支える</div>
        </div>
        <div style={{ position: "absolute", left: 1330, top: 330, width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * pop(frame, 1.8)})` }}>
          <IconFactory size={300} color={C.text} stroke={2} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: prog(frame, 3.0), transform: `scale(${1.6 - 0.6 * prog(frame, 3.0, 0.6)}) rotate(${(1 - prog(frame, 3.0, 0.6)) * 90}deg)` }}>
            <IconTarget size={420} color={C.red} stroke={1.6} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1330, top: 770, width: 420, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 3, fontWeight: 700, color: C.red, opacity: prog(frame, 3.6) }}>
          TARGET LOCKED ： FA
        </div>
      </div>

      {/* フェーズB：工場のライン */}
      <div style={{ position: "absolute", inset: 0, opacity: factoryIn }}>
        <div style={{ position: "absolute", left: 92, top: 270, display: "flex", gap: 20 }}>
          {[
            { l: "食品", I: IconBottle },
            { l: "自動車", I: IconCar },
            { l: "電子機器", I: IconCircuit },
          ].map((x, i) => (
            <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 12, border: `2px solid ${C.line}`, borderRadius: 40, padding: "6px 22px 6px 12px", background: "#fff", ...rise(frame, phaseB + 0.6 + i * 0.3) }}>
              <x.I size={44} color={C.text} />
              <span style={{ fontSize: 30, fontWeight: 700 }}>{x.l}の工場</span>
            </div>
          ))}
        </div>
        <ConveyorLine t={t - phaseB} />
        <div style={{ position: "absolute", left: 1220, top: 270, width: 608, padding: "18px 26px", background: C.text, color: "#fff", borderRadius: 10, boxSizing: "border-box", ...rise(frame, here) }}>
          <HudTag color="#FF6B7D">MISSION POINT</HudTag>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 4 }}>ここに、センサ営業の仕事がある。</div>
        </div>
        <div style={{ position: "absolute", left: 1220, top: 680, width: 608, padding: "16px 24px", border: `2px dashed ${C.text}`, borderRadius: 10, boxSizing: "border-box", fontSize: 28, lineHeight: 1.45, background: "#fff", ...rise(frame, q) }}>
          <b>Q.</b> 工場見学やTV番組で「製造工程」を見たことはありますか？
        </div>
      </div>
    </SceneFrame>
  );
};

// コンベヤ上の製品をセンサが検出してカウントする模式図
export const ConveyorLine: React.FC<{ t: number; miscount?: boolean; x?: number; y?: number; w?: number }> = ({ t, miscount, x = 92, y = 420, w = 1080 }) => {
  const speed = 140; // px/s
  const spacing = 170;
  const sensorX = w * 0.55;
  const travelled = Math.max(0, t) * speed;
  // miscount：4個に1組、2個が密着して流れる（数え間違いの架空例）
  const posOf = (i: number) => travelled - i * spacing + (miscount && i % 4 === 1 ? -spacing + 64 : 0);
  let passed = 0;
  while (passed < 2000 && posOf(passed) > sensorX) passed++;
  const missed = miscount ? Math.floor((passed + 1) / 4) : 0;
  const first = Math.max(0, Math.floor((travelled - w - 60) / spacing));
  const items: React.ReactNode[] = [];
  let hit = false;
  for (let i = first; i < first + Math.ceil(w / spacing) + 4; i++) {
    const px = posOf(i);
    if (px < -60 || px > w + 60) continue;
    const under = Math.abs(px - sensorX) < 32;
    hit = hit || under;
    items.push(<div key={i} style={{ position: "absolute", left: px - 30, top: 108, width: 60, height: 60, background: under ? C.red : C.text, borderRadius: 6 }} />);
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 300, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 300, overflow: "hidden" }}>{items}</div>
      {/* ベルト */}
      <div style={{ position: "absolute", left: -10, top: 170, width: w + 20, height: 26, borderRadius: 13, background: C.text }} />
      {Array.from({ length: Math.ceil((w + 60) / 60) }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: ((i * 60 + travelled) % (w + 60)) - 30, top: 176, width: 14, height: 14, borderRadius: 7, background: "#4A6079" }} />
      ))}
      {/* センサ（上から検出） */}
      <div style={{ position: "absolute", left: sensorX - 50, top: -10, color: C.text }}>
        <IconSensor size={100} color={C.text} style={{ transform: "rotate(90deg)" }} />
      </div>
      <div style={{ position: "absolute", left: sensorX - 4, top: 78, width: 8, height: 92, background: hit ? C.red : "rgba(220,9,36,0.3)", boxShadow: hit ? "0 0 22px 6px rgba(220,9,36,0.5)" : "none" }} />
      <div style={{ position: "absolute", left: 0, top: 220, display: "flex", gap: 30, alignItems: "baseline" }}>
        <span style={{ fontSize: 28, color: "#4A6079" }}>センサの検出数</span>
        <span style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, color: miscount ? C.red : C.text }}>{String(Math.max(0, passed - missed)).padStart(4, "0")}</span>
        {miscount && (
          <>
            <span style={{ fontSize: 28, color: "#4A6079" }}>実際の数</span>
            <span style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700 }}>{String(passed).padStart(4, "0")}</span>
          </>
        )}
      </div>
      <div style={{ position: "absolute", right: 0, top: 230, opacity: 0.5 }}>
        <IconGear size={56} color={C.text} style={{ transform: `rotate(${t * 60}deg)` }} />
      </div>
    </div>
  );
};
