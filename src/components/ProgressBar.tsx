import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #F97316 0%, #FBBF24 100%)",
          boxShadow: "0 0 12px rgba(251, 191, 36, 0.8)",
          borderRadius: "0 6px 6px 0",
        }}
      />
    </div>
  );
};
