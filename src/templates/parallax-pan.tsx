"use client";
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ParallaxPanProps {
  imageUrl?: string;
  duration?: number;
  direction?: "left-right" | "right-left" | "top-bottom" | "bottom-top";
  scale?: number;
}

export const ParallaxPan: React.FC<ParallaxPanProps> = ({
  imageUrl = "https://images.pexels.com/photos/1644724/pexels-photo-1644724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 15,
  direction = "left-right",
  scale = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  const progress = interpolate(frame % totalFrames, [0, totalFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  let transform = `scale(${scale})`;
  if (direction === "left-right") {
    const x = interpolate(progress, [0, 1], [0, -20]);
    transform = `translateX(${x}%) scale(${scale})`;
  } else if (direction === "right-left") {
    const x = interpolate(progress, [0, 1], [-20, 0]);
    transform = `translateX(${x}%) scale(${scale})`;
  } else if (direction === "top-bottom") {
    const y = interpolate(progress, [0, 1], [0, -20]);
    transform = `translateY(${y}%) scale(${scale})`;
  } else if (direction === "bottom-top") {
    const y = interpolate(progress, [0, 1], [-20, 0]);
    transform = `translateY(${y}%) scale(${scale})`;
  }

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
          transform,
        }}
      />
    </div>
  );
};

export default ParallaxPan;
