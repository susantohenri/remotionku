import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionData } from "../types";

export const CaptionOverlay: React.FC<{
  caption: CaptionData;
  bottomOffset?: number;
}> = ({ caption, bottomOffset = 340 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy punchy spring for modern TikTok pacing
  const headlineSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 160,
    },
  });

  // Delayed entrance for subText
  const subTextSpring = spring({
    frame: frame - 4,
    fps,
    config: {
      damping: 14,
      mass: 0.7,
      stiffness: 140,
    },
  });

  // Render text with high-impact TikTok/Reels sticker tags for highlight keywords
  const renderStyledHeadline = () => {
    const { headline, highlightWords } = caption;
    if (!highlightWords || highlightWords.length === 0) {
      return (
        <span
          style={{
            color: "#FFFFFF",
            WebkitTextStroke: "2.5px #000000",
            textShadow: "0 6px 0 #000000, 0 12px 30px rgba(0,0,0,0.9)",
          }}
        >
          {headline}
        </span>
      );
    }

    const escaped = highlightWords.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = headline.split(regex);

    return parts.map((part, index) => {
      const isHighlight = highlightWords.some(
        (hw) => hw.toLowerCase() === part.toLowerCase()
      );

      if (isHighlight) {
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              backgroundColor: "#FFE600", // High-voltage canary yellow
              color: "#000000", // Pure black text for maximum contrast
              padding: "4px 16px",
              borderRadius: 14,
              margin: "0 8px",
              fontWeight: 950,
              boxShadow:
                "0 8px 24px rgba(255, 230, 0, 0.65), 0 3px 0 #CA8A04",
              transform: "rotate(-1.5deg)",
              letterSpacing: "0px",
              verticalAlign: "middle",
            }}
          >
            {part}
          </span>
        );
      }

      return (
        <span
          key={index}
          style={{
            color: "#FFFFFF",
            WebkitTextStroke: "2.5px #000000",
            textShadow: "0 6px 0 #000000, 0 12px 30px rgba(0,0,0,0.9)",
          }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: bottomOffset,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      {/* High-Contrast Floating Glass Card */}
      <div
        style={{
          transform: `scale(${interpolate(
            headlineSpring,
            [0, 1],
            [0.82, 1]
          )}) translateY(${interpolate(headlineSpring, [0, 1], [40, 0])}px)`,
          opacity: headlineSpring,
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.97) 100%)",
          backdropFilter: "blur(24px) saturate(190%)",
          border: "2.5px solid rgba(255, 255, 255, 0.28)",
          borderRadius: 32,
          padding: "26px 44px",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.4)",
          marginBottom: 16,
          maxWidth: "96%",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 68,
            fontWeight: 950,
            lineHeight: 1.25,
            letterSpacing: "0.5px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
            textTransform: "uppercase",
          }}
        >
          {renderStyledHeadline()}
        </h1>
      </div>

      {/* SubText Pill (Elevated Contrast & Larger Typography) */}
      {caption.subText && (
        <div
          style={{
            transform: `translateY(${interpolate(
              subTextSpring,
              [0, 1],
              [25, 0]
            )}px)`,
            opacity: subTextSpring,
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(16px)",
            border: "2px solid rgba(250, 204, 21, 0.6)", // Warm gold rim
            borderRadius: 50,
            padding: "16px 38px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            maxWidth: "92%",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 800,
              color: "#FEF08A", // Soft bright gold
              lineHeight: 1.35,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
              textShadow: "0 3px 10px rgba(0, 0, 0, 0.9)",
              letterSpacing: "0.3px",
            }}
          >
            {caption.subText}
          </p>
        </div>
      )}
    </div>
  );
};
