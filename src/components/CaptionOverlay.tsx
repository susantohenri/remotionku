import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionData, ThemeConfig } from "../types";

export const CaptionOverlay: React.FC<{
  caption: CaptionData;
  bottomOffset?: number;
  theme?: ThemeConfig;
  isHookScene?: boolean;
}> = ({ caption, bottomOffset = 340, theme, isHookScene = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smart defaults if not explicitly specified
  const position = caption.position ?? (isHookScene ? "center" : "bottom");
  const style = caption.style ?? (isHookScene ? "kinetic-sticker" : "card");
  const size = caption.size ?? (isHookScene ? "huge" : "normal");

  // Font sizing
  const headlineFontSize = size === "huge" ? 88 : size === "compact" ? 48 : 64;
  const subTextFontSize = size === "huge" ? 42 : size === "compact" ? 28 : 36;

  // Snappy punchy spring for modern short-form pacing
  const headlineSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 170,
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
        const bg = theme?.accentColor ?? "#FFE600";
        const fg = theme?.textColor ?? "#000000";
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              backgroundColor: bg,
              color: fg,
              padding: "4px 18px",
              borderRadius: 16,
              margin: "0 8px",
              fontWeight: 950,
              boxShadow: `0 8px 24px ${bg}aa, 0 4px 0 rgba(0,0,0,0.35)`,
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

  // Dynamic positioning CSS
  const getPositionStyle = (): React.CSSProperties => {
    if (position === "center") {
      return {
        position: "absolute",
        top: "48%",
        left: 40,
        right: 40,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 25,
      };
    }
    if (position === "top") {
      return {
        position: "absolute",
        top: 200, // Safe zone: clearly below TikTok/Shorts search bar & top tabs
        left: 40,
        right: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 25,
      };
    }
    // Default "bottom"
    return {
      position: "absolute",
      bottom: bottomOffset,
      left: 40,
      right: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      zIndex: 25,
    };
  };

  // Dynamic card wrapper CSS
  const getCardStyle = (): React.CSSProperties => {
    if (style === "kinetic-sticker") {
      // Floating bold text directly over video (TikTok native style)
      return {
        background: "none",
        border: "none",
        boxShadow: "none",
        padding: 0,
        marginBottom: 16,
        maxWidth: "96%",
      };
    }

    if (style === "minimal-pill") {
      return {
        background: "rgba(15, 23, 42, 0.82)",
        backdropFilter: "blur(18px)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 40,
        padding: "16px 36px",
        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
        marginBottom: 12,
        maxWidth: "92%",
      };
    }

    // Default "card" style
    return {
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.97) 100%)",
      backdropFilter: "blur(24px) saturate(190%)",
      border: "2.5px solid rgba(255, 255, 255, 0.28)",
      borderRadius: 32,
      padding: "24px 40px",
      boxShadow:
        "0 30px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.4)",
      marginBottom: 16,
      maxWidth: "96%",
    };
  };

  return (
    <div style={getPositionStyle()}>
      {/* Main Headline Container */}
      <div
        style={{
          transform: `scale(${interpolate(
            headlineSpring,
            [0, 1],
            [0.85, 1]
          )}) translateY(${interpolate(headlineSpring, [0, 1], [30, 0])}px)`,
          opacity: headlineSpring,
          ...getCardStyle(),
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: headlineFontSize,
            fontWeight: 950,
            lineHeight: 1.22,
            letterSpacing: "0.5px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
            textTransform: "uppercase",
          }}
        >
          {renderStyledHeadline()}
        </h1>
      </div>

      {/* SubText Pill */}
      {caption.subText && (
        <div
          style={{
            transform: `translateY(${interpolate(
              subTextSpring,
              [0, 1],
              [20, 0]
            )}px)`,
            opacity: subTextSpring,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(16px)",
            border: `2px solid ${theme?.accentColor ?? "rgba(250, 204, 21, 0.6)"}`,
            borderRadius: 50,
            padding: "12px 34px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            maxWidth: "90%",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: subTextFontSize,
              fontWeight: 800,
              color: "#FFFFFF",
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
