import React from "react";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile } from "remotion";
import { FPS, isChapterStart, NARRATION, sec, SCENES, Scene, TOTAL_FRAMES } from "./data/chapters";
import { Scene01, Scene02, Scene03 } from "./scenes/Ch01";
import { Scene04, Scene05 } from "./scenes/Ch02";
import { Scene06, Scene07, Scene08, Scene09, Scene10 } from "./scenes/Ch03";
import { Scene11, Scene12, Scene13, Scene14, Scene15, Scene16 } from "./scenes/Ch04to06";

const SCENE_COMPONENTS: Record<number, React.FC<{ scene: Scene }>> = {
  1: Scene01, 2: Scene02, 3: Scene03, 4: Scene04, 5: Scene05, 6: Scene06, 7: Scene07, 8: Scene08,
  9: Scene09, 10: Scene10, 11: Scene11, 12: Scene12, 13: Scene13, 14: Scene14, 15: Scene15, 16: Scene16,
};

export type OrientationProps = { bgmVolume: number; sfxVolume: number; narrationVolume: number };

// シーン内の効果音（シーン相対秒）
const SFX: { scene: number; at: number; file: string }[] = [
  { scene: 1, at: 0.05, file: "beep" },
  { scene: 1, at: 5.0, file: "scan" },
  { scene: 1, at: 8.2, file: "unlock" },
  ...SCENES.filter((s) => isChapterStart(s) && s.id !== 1).flatMap((s) => [
    { scene: s.id, at: 0.6, file: "scan" },
    { scene: s.id, at: 1.6, file: "unlock" },
  ]),
  ...SCENES.filter((s) => s.pause).map((s) => ({ scene: s.id, at: s.pause!.atSeconds, file: "beep" })),
  { scene: 10, at: 5.9, file: "evidence" },
  { scene: 13, at: 14.4, file: "evidence" },
  { scene: 16, at: 0.3, file: "cleared" },
  { scene: 16, at: 6.4, file: "unlock" },
];

// BGM：ナレーション中・停止カード表示中は下げる（ダッキング）
const bgmLevel = (frame: number, base: number) => {
  const t = frame / FPS;
  const scene = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const local = t - scene.start;
  const n = NARRATION[String(scene.id)];
  const speaking = local >= n.offset - 0.2 && local <= n.offset + n.duration + 0.2;
  const paused = scene.pause && local >= scene.pause.atSeconds;
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - sec(2.5), TOTAL_FRAMES - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return base * (paused ? 0.35 : speaking ? 0.45 : 1) * fadeOut;
};

export const Orientation: React.FC<OrientationProps> = ({ bgmVolume, sfxVolume, narrationVolume }) => {
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const n = NARRATION[String(s.id)];
        return (
          <Sequence key={s.id} from={sec(s.start)} durationInFrames={sec(s.end - s.start)} name={`SC${String(s.id).padStart(2, "0")} ${s.title}`}>
            <Comp scene={s} />
            <Sequence from={sec(n.offset)} name="narration" layout="none">
              <Html5Audio src={staticFile(n.file)} volume={narrationVolume} />
            </Sequence>
            {SFX.filter((x) => x.scene === s.id).map((x, i) => (
              <Sequence key={i} from={sec(x.at)} durationInFrames={sec(2)} name={`sfx ${x.file}`} layout="none">
                <Html5Audio src={staticFile(`assets/sfx/${x.file}.wav`)} volume={sfxVolume} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Html5Audio src={staticFile("assets/bgm/bgm.wav")} loop volume={(f) => bgmLevel(f, bgmVolume)} />
    </AbsoluteFill>
  );
};
