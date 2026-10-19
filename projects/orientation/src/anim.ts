import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./data/chapters";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// frame（シーン相対）が startSec から durSec かけて 0→1
export const prog = (frame: number, startSec: number, durSec = 0.5) =>
  interpolate(frame, [startSec * FPS, (startSec + durSec) * FPS], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

export const linear = (frame: number, startSec: number, durSec: number) =>
  interpolate(frame, [startSec * FPS, (startSec + durSec) * FPS], [0, 1], clamp);

export const pop = (frame: number, startSec: number) =>
  spring({ frame: frame - startSec * FPS, fps: FPS, config: { damping: 14, stiffness: 160 } });

// フェードイン + 下からスライド
export const rise = (frame: number, startSec: number, dist = 24, durSec = 0.6) => {
  const p = prog(frame, startSec, durSec);
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

export const blink = (frame: number, periodSec = 0.8) => (Math.floor(frame / (periodSec * FPS / 2)) % 2 === 0 ? 1 : 0.25);
