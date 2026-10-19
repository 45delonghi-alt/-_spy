import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, Scene, sentenceAt } from "../data/chapters";
import { C, FONT, MONO } from "../theme";
import { pop, prog, rise } from "../anim";
import { SceneFrame } from "../components/SceneFrame";
import { EvidenceCard, FileUnlock, HudTag, Note, Stamp, Thread } from "../components/Kit";
import { IconAI, IconBottle, IconCar, IconChat, IconChip, IconCircuit, IconHandshake, IconMemo, IconPerson, IconSearch, IconSensor } from "../components/Icons";
import { ConveyorLine } from "./Ch02";

// SC06 FILE 01～03 の調査資料がアンロック
export const Scene06: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const base = sentenceAt(scene, 1) + 0.6;
  const files = [
    { no: "01", title: "産業", sub: "日本の主要産業を支える" },
    { no: "02", title: "課題解決", sub: "現場の課題を解決する" },
    { no: "03", title: "人の価値", sub: "AI時代に人の力を生かす" },
  ];
  return (
    <SceneFrame scene={scene} label="CLASSIFIED FILES">
      <div style={{ position: "absolute", right: 60, top: 120, fontSize: 900, fontWeight: 900, color: C.sub, lineHeight: 1, opacity: prog(frame, 2.6) }}>3</div>
      {files.map((f, i) => (
        <FileUnlock key={f.no} at={base + i * 0.9} no={f.no} title={f.title} sub={f.sub} x={150 + i * 580} y={320} w={480} h={440} />
      ))}
    </SceneFrame>
  );
};

// SC07 FILE 01：産業を支える証拠を収集（P7の4象限＋中央を継承）
export const Scene07: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s2 = sentenceAt(scene, 2);
  const s3 = sentenceAt(scene, 3);
  const s4 = sentenceAt(scene, 4);
  const s5 = sentenceAt(scene, 5);
  const W = 720;
  const H = 230;
  const cards = [
    { no: "01", title: "三品業界", sub: "食品・医薬品・化粧品\n容器やラベルの有無を確認", icon: <IconBottle size={92} />, x: 92, y: 290, at: s2 },
    { no: "02", title: "電機・電子業界", sub: "部品の位置・有無を検出", icon: <IconCircuit size={92} />, x: 1108, y: 290, at: s3 },
    { no: "03", title: "自動車業界", sub: "組立工程で部品を確認", icon: <IconCar size={92} />, x: 92, y: 560, at: s3 + 1.0 },
    { no: "04", title: "半導体業界", sub: "ウエハなどの搬送を確認", icon: <IconChip size={92} />, x: 1108, y: 560, at: s3 + 2.0 },
  ];
  const center = { x: 960, y: 535 };
  return (
    <SceneFrame scene={scene} label="FILE 01 / 産業を支える証拠">
      {cards.map((c) => (
        <Thread key={`t${c.no}`} at={c.at + 0.3} x1={center.x} y1={center.y} x2={c.x + W / 2} y2={c.y + H / 2} dashed />
      ))}
      {cards.map((c) => (
        <EvidenceCard key={c.no} at={c.at} no={c.no} title={c.title} sub={c.sub} icon={c.icon} x={c.x} y={c.y} w={W} h={H} />
      ))}
      <div style={{ position: "absolute", left: center.x - 125, top: center.y - 85, width: 250, height: 170, background: C.text, color: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transform: `scale(${pop(frame, sentenceAt(scene, 1))})`, zIndex: 5, boxShadow: s4 < frame / FPS ? "0 0 0 8px rgba(220,9,36,0.25)" : "none" }}>
        <IconSensor size={60} color="#fff" />
        <div style={{ fontSize: 27, fontWeight: 900, textAlign: "center", lineHeight: 1.3 }}>
          正しく検出し、
          <br />
          安定して製造する
        </div>
      </div>
      <Stamp at={s5} text="非常に社会貢献度の高い仕事" x={960} y={820} size={40} rotate={-3} />
      <Note y={826} x={1340}>
        ※検出内容は一般的なイメージ例
      </Note>
    </SceneFrame>
  );
};

// SC08 FILE 02：製造課題→聞く→確かめる→解決策 を捜査線で結ぶ（架空例）
export const Scene08: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ex = sentenceAt(scene, 2);
  const notJust = sentenceAt(scene, 3);
  const flow = sentenceAt(scene, 4);
  const future = sentenceAt(scene, 5);
  const nodes = [
    { k: "課題", t: "数え間違い", I: IconSearch, red: true },
    { k: "聞く", t: "なぜ起きる？", I: IconChat },
    { k: "確かめる", t: "現物・条件", I: IconMemo },
    { k: "一緒に考える", t: "最適な解決策", I: IconHandshake },
  ];
  const futureIn = prog(frame, future, 0.5);
  return (
    <SceneFrame scene={scene} label="FILE 02 / 捜査線を結ぶ">
      {/* 架空のケース */}
      <div style={{ position: "absolute", left: 92, top: 262, opacity: prog(frame, ex - 0.4) * (1 - 0.75 * futureIn) }}>
        <HudTag>CASE（説明用の架空例）：製品を数え間違えるライン</HudTag>
      </div>
      <div style={{ opacity: prog(frame, ex - 0.4) * (1 - 0.75 * futureIn) }}>
        <ConveyorLine t={t - ex + 3} miscount x={92} y={250} w={1020} />
      </div>
      {/* ただ紹介するのではない */}
      <div style={{ position: "absolute", left: 1200, top: 300, width: 628, height: 220, border: `2px solid ${C.line}`, borderRadius: 10, background: C.sub, boxSizing: "border-box", padding: "24px 30px", opacity: prog(frame, notJust - 0.3) * (1 - 0.75 * futureIn) }}>
        <div style={{ fontSize: 30, color: "#4A6079" }}>必要なのは…</div>
        <div style={{ position: "relative", display: "inline-block", fontSize: 40, fontWeight: 900, marginTop: 14 }}>
          ただセンサを紹介すること
          <div style={{ position: "absolute", left: -8, top: "52%", height: 6, background: C.red, width: `${prog(frame, notJust + 1.6, 0.4) * 104}%` }} />
        </div>
        <div style={{ fontSize: 30, color: C.red, fontWeight: 700, marginTop: 10, opacity: prog(frame, notJust + 2) }}>…ではありません</div>
      </div>
      {/* 捜査線 */}
      {nodes.slice(1).map((_, i) => (
        <Thread key={`th${i}`} at={flow + i * 1.4 + 0.6} x1={92 + 210 + i * 440} y1={700} x2={92 + 210 + (i + 1) * 440} y2={700} dur={0.5} />
      ))}
      {nodes.map((n, i) => {
        const at = i === 0 ? ex + 2 : flow + (i - 1) * 1.4 + 1;
        const p = pop(frame, at);
        return (
          <div key={n.k} style={{ position: "absolute", left: 92 + i * 440, top: 600, width: 420, height: 200, background: n.red ? C.red : "#fff", color: n.red ? "#fff" : C.text, border: `3px solid ${n.red ? C.red : C.text}`, borderRadius: 12, boxSizing: "border-box", padding: "20px 24px", display: "flex", gap: 18, alignItems: "center", transform: `scale(${p})`, opacity: 1 - 0.6 * futureIn }}>
            <n.I size={80} color={n.red ? "#fff" : C.text} />
            <div>
              <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, opacity: 0.7 }}>STEP {i}</div>
              <div style={{ fontSize: 40, fontWeight: 900 }}>{n.k}</div>
              <div style={{ fontSize: 28 }}>{n.t}</div>
            </div>
          </div>
        );
      })}
      {/* 結論 */}
      <div style={{ position: "absolute", left: 260, right: 260, top: 400, padding: "34px 40px", background: C.text, color: "#fff", borderRadius: 12, textAlign: "center", opacity: futureIn, transform: `scale(${0.94 + 0.06 * futureIn})`, zIndex: 10 }}>
        <HudTag color="#FF6B7D">EVIDENCE</HudTag>
        <div style={{ fontSize: 50, fontWeight: 900, marginTop: 8 }}>センサは、未来のものづくりを支える存在</div>
      </div>
    </SceneFrame>
  );
};

// SC09 FILE 03：AIと人間の役割分担を比較分析（「置き換え不可能」とは断定しない）
export const Scene09: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s1 = sentenceAt(scene, 1);
  const s2 = sentenceAt(scene, 2);
  const s3 = sentenceAt(scene, 3);
  const ai = ["情報の整理", "提案資料の準備", "データ処理・定型業務"];
  const human = ["お客様の本音を引き出す", "信頼関係を築く", "関係者の合意を得る"];
  const Col: React.FC<{ x: number; at: number; itemsAt: number; head: string; tag: string; items: string[]; Icon: React.FC<{ size?: number; color?: string }>; dark?: boolean }> = ({
    x,
    at,
    itemsAt,
    head,
    tag,
    items,
    Icon,
    dark,
  }) => (
    <div style={{ position: "absolute", left: x, top: 270, width: 740, height: 540, background: dark ? C.text : "#fff", color: dark ? "#fff" : C.text, border: `3px solid ${C.text}`, borderRadius: 10, boxSizing: "border-box", padding: "30px 40px", ...rise(frame, at - 0.4) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Icon size={84} color={dark ? "#fff" : C.text} />
        <div>
          <HudTag color={dark ? "#FF6B7D" : C.red}>{tag}</HudTag>
          <div style={{ fontSize: 44, fontWeight: 900 }}>{head}</div>
        </div>
      </div>
      <div style={{ height: 2, background: dark ? "#2F4A6A" : C.line, margin: "22px 0 10px" }} />
      {items.map((it, i) => (
        <div key={it} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24, ...rise(frame, itemsAt + i * 0.7, 16) }}>
          <div style={{ width: 16, height: 16, background: C.red, transform: "rotate(45deg)" }} />
          <div style={{ fontSize: 40, fontWeight: 700 }}>{it}</div>
        </div>
      ))}
    </div>
  );
  const link = prog(frame, s3 + 4, 0.5);
  return (
    <SceneFrame scene={scene} label="FILE 03 / 役割分担の比較分析">
      <Col x={92} at={s1 + 0.4} itemsAt={s2 + 0.4} head="AI・テクノロジー" tag="SUPPORT" items={ai} Icon={IconAI} />
      <Col x={1088} at={s1 + 1.4} itemsAt={s3 + 0.4} head="センサ営業（人）" tag="HUMAN STRENGTH" items={human} Icon={IconPerson} dark />
      <div style={{ position: "absolute", left: 960 - 80, top: 470, width: 160, height: 160, borderRadius: 80, background: "#fff", border: `4px solid ${C.red}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, s3 + 3.5)})`, zIndex: 5 }}>
        <div style={{ fontSize: 36, color: C.red, lineHeight: 1 }}>⇄</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: C.red }}>協働</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 822, textAlign: "center", fontSize: 30, fontWeight: 700, opacity: link }}>
        AIを使いこなしながら、人ならではの強みを磨く
      </div>
    </SceneFrame>
  );
};

// SC10 3つの証拠ファイル統合
export const Scene10: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const items = [
    { t: "産業を支える", from: -620 },
    { t: "課題を解く", from: 0 },
    { t: "人と向き合う", from: 620 },
  ];
  const merge = prog(frame, 1.2, 1.4);
  return (
    <SceneFrame scene={scene} label="FILES 01–03 INTEGRATED">
      {items.map((it, i) => {
        const x = interpolate(merge, [0, 1], [it.from, Math.cos((i * 2 * Math.PI) / 3 - Math.PI / 2) * 400]);
        const y = interpolate(merge, [0, 1], [0, Math.sin((i * 2 * Math.PI) / 3 - Math.PI / 2) * 230 + 40]);
        return (
          <div key={it.t} style={{ position: "absolute", left: 960 + x - 170, top: 600 + y - 50, width: 340, height: 100, background: "#fff", border: `3px solid ${C.text}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 900, fontFamily: FONT, ...rise(frame, 0.2 + i * 0.25) }}>
            <span style={{ fontFamily: MONO, fontSize: 20, color: C.red, marginRight: 14 }}>0{i + 1}</span>
            {it.t}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 960 - 150, top: 600 - 60, width: 300, height: 120, borderRadius: 60, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 900, transform: `scale(${pop(frame, sentenceAt(scene, 1) - 0.3)})` }}>
        センサ営業
      </div>
      <Stamp at={sentenceAt(scene, 1) + 1.4} text="EVIDENCE COMPLETE" x={1520} y={340} size={36} color={C.ok} />
    </SceneFrame>
  );
};
