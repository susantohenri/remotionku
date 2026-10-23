"use client";
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface KenBurnsProps {
  imageUrl?: string;
  duration?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  imageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
  duration = 20,
  scale = 1.5,
  translateX = -50,
  translateY = -30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  const currentScale = interpolate(frame, [0, totalFrames], [1, scale], {
    extrapolateRight: "clamp",
  });
  const currentX = interpolate(frame, [0, totalFrames], [0, translateX], {
    extrapolateRight: "clamp",
  });
  const currentY = interpolate(frame, [0, totalFrames], [0, translateY], {
    extrapolateRight: "clamp",
  });

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
          transform: `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`,
        }}
      />
    </div>
  );
};
