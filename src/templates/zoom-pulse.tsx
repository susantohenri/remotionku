"use client";
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ZoomPulseProps {
  imageUrl?: string;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export const ZoomPulse: React.FC<ZoomPulseProps> = ({
  imageUrl = "https://images.pexels.com/photos/1726310/pexels-photo-1726310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 4,
  minScale = 1,
  maxScale = 1.1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  const halfCycle = totalFrames / 2;
  const currentFrameInCycle = frame % totalFrames;

  const currentScale =
    currentFrameInCycle <= halfCycle
      ? interpolate(currentFrameInCycle, [0, halfCycle], [minScale, maxScale], {
          extrapolateRight: "clamp",
        })
      : interpolate(
          currentFrameInCycle,
          [halfCycle, totalFrames],
          [maxScale, minScale],
          {
            extrapolateRight: "clamp",
          }
        );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Img
        src={imageUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${currentScale})`,
        }}
      />
    </div>
  );
};

export default ZoomPulse;
