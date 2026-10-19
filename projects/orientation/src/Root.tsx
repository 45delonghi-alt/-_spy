import React from "react";
import { Composition } from "remotion";
import { Orientation, OrientationProps } from "./Orientation";
import { FPS, META, TOTAL_FRAMES } from "./data/chapters";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Orientation"
      component={Orientation}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={META.width}
      height={META.height}
      defaultProps={{ bgmVolume: 0.22, sfxVolume: 0.5, narrationVolume: 1 } satisfies OrientationProps}
    />
  );
};
