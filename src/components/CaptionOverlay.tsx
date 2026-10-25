import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionData, ThemeConfig } from "../types";
import {
  getFontFamilyStack,
  resolveCreativeCaption,
} from "../utils/creativeTextDirector";

export const CaptionOverlay: React.FC<{
  caption: CaptionData;
  bottomOffset?: number;
  theme?: ThemeConfig;
  isHookScene?: boolean;
  sceneIndex?: number;
  fallbackSubtitle?: string;
}> = ({
  caption,
  bottomOffset = 340,
  theme,
  isHookScene = false,
  sceneIndex = 0,
  fallbackSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve all creative parameters (guaranteed diverse, creative, un-templated)
  const resolved = resolveCreativeCaption(
    caption,
    sceneIndex,
    isHookScene,
    theme
  );

  const {
    placement,
    style,
    animation,
    fontTheme,
    headlineFontSize,
    subTextFontSize,
    tiltDeg,
    align,
    colors,
    badgeText,
    highlightWords,
  } = resolved;

  const fontFamily = getFontFamilyStack(fontTheme);

  // Springs & Motion
  const mainSpring = spring({
    frame,
    fps,
    config: {
      damping: animation === "slam" ? 18 : 12,
      mass: animation === "slam" ? 0.35 : 0.6,
      stiffness: animation === "slam" ? 220 : 160,
    },
  });

  const subSpring = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 14,
      mass: 0.7,
      stiffness: 140,
    },
  });

  // Ambient organic float so text doesn't look static
  const floatY = Math.sin((frame / 14) * Math.PI) * 4;
  const pulseScale = 1 + Math.sin((frame / 20) * Math.PI) * 0.015;

  // Animation transforms
  let entranceTransform = "";
  let entranceOpacity = mainSpring;

  if (animation === "slam") {
    const scale = interpolate(mainSpring, [0, 1], [2.2, 1]);
    const impactJitter =
      frame >= 3 && frame <= 7 ? (frame % 2 === 0 ? 3 : -3) : 0;
    entranceTransform = `scale(${scale}) translateY(${impactJitter}px)`;
    entranceOpacity = interpolate(frame, [0, 3], [0, 1], {
      extrapolateRight: "clamp",
    });
  } else if (animation === "whip") {
    const slideOffset = interpolate(mainSpring, [0, 1], [
      placement.includes("right") ? 200 : -200,
      0,
    ]);
    const rotate = interpolate(mainSpring, [0, 1], [
      placement.includes("right") ? 8 : -8,
      tiltDeg,
    ]);
    entranceTransform = `translateX(${slideOffset}px) rotate(${rotate}deg)`;
  } else if (animation === "glitch") {
    const jitterX =
      frame < 8 ? Math.sin(frame * 12) * (8 - frame) : 0;
    const jitterY =
      frame < 8 ? Math.cos(frame * 14) * (6 - frame) : 0;
    entranceTransform = `translate(${jitterX}px, ${jitterY}px) scale(${interpolate(
      mainSpring,
      [0, 1],
      [0.9, 1]
    )})`;
  } else {
    // Default snappy pop
    const scale = interpolate(mainSpring, [0, 1], [0.82, 1]);
    const translateY = interpolate(mainSpring, [0, 1], [35, 0]);
    entranceTransform = `translateY(${translateY}px) scale(${scale})`;
  }

  // 1. Placement Positioning Rules
  const getContainerPosition = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      zIndex: 26,
      display: "flex",
      flexDirection: "column",
      alignItems:
        align === "left"
          ? "flex-start"
          : align === "right"
          ? "flex-end"
          : "center",
      textAlign: align,
      pointerEvents: "none",
    };

    switch (placement) {
      case "center":
        return {
          ...base,
          top: "48%",
          left: 50,
          right: 50,
          transform: "translateY(-50%)",
        };
      case "center-left":
        return {
          ...base,
          top: "48%",
          left: 60,
          right: 120,
          transform: "translateY(-50%)",
        };
      case "center-right":
        return {
          ...base,
          top: "48%",
          left: 120,
          right: 60,
          transform: "translateY(-50%)",
        };
      case "top":
      case "top-center":
        return {
          ...base,
          top: 220,
          left: 50,
          right: 50,
        };
      case "top-left":
        return {
          ...base,
          top: 220,
          left: 60,
          right: 100,
        };
      case "top-right":
        return {
          ...base,
          top: 220,
          left: 100,
          right: 60,
        };
      case "bottom-left":
        return {
          ...base,
          bottom: bottomOffset,
          left: 60,
          right: 120,
        };
      case "bottom-right":
        return {
          ...base,
          bottom: bottomOffset,
          left: 120,
          right: 60,
        };
      case "split-diagonal":
        return {
          ...base,
          top: "38%",
          left: 50,
          right: 50,
        };
      case "bottom":
      case "bottom-center":
      default:
        return {
          ...base,
          bottom: bottomOffset,
          left: 50,
          right: 50,
        };
    }
  };

  // 2. Headline Wrapper Styles (Aesthetics)
  const getWrapperStyle = (): React.CSSProperties => {
    switch (style) {
      case "kinetic-sticker":
      case "floating-ghost":
        // Floating pure text directly on canvas - zero box enclosure!
        return {
          background: "none",
          border: "none",
          boxShadow: "none",
          padding: 0,
          marginBottom: 16,
          maxWidth: "98%",
        };

      case "cyber-neon":
        return {
          background: colors.wrapperBg,
          backdropFilter: "blur(20px)",
          border: `2px solid ${colors.borderColor}`,
          borderRadius: 14,
          padding: "24px 38px",
          boxShadow: `0 0 35px ${colors.glowColor}, inset 0 0 20px rgba(0, 245, 255, 0.15)`,
          marginBottom: 16,
          maxWidth: "96%",
          position: "relative",
        };

      case "comic-pop":
        return {
          backgroundColor: colors.wrapperBg,
          border: "4px solid #000000",
          borderRadius: 24,
          padding: "22px 36px",
          boxShadow: "8px 8px 0px #000000",
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "streetwear-brutal":
        return {
          backgroundColor: colors.wrapperBg,
          border: `3.5px solid ${colors.borderColor}`,
          borderRadius: 0, // Brutalist sharp edge
          padding: "20px 32px",
          boxShadow: "10px 10px 0px rgba(0, 0, 0, 0.9)",
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "editorial-luxury":
        return {
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.82) 0%, rgba(2, 6, 23, 0.88) 100%)",
          backdropFilter: "blur(24px)",
          border: `1.5px solid ${colors.borderColor}`,
          borderRadius: 20,
          padding: "24px 44px",
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.75), 0 0 25px ${colors.glowColor}`,
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "magazine-cutout":
        return {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: "10px 0",
          marginBottom: 16,
          maxWidth: "98%",
        };

      case "gradient-glass":
        return {
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          border: "2px solid rgba(255, 255, 255, 0.35)",
          borderRadius: 36,
          padding: "24px 40px",
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 30px ${colors.glowColor}`,
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "retro-synthwave":
        return {
          background:
            "linear-gradient(180deg, rgba(24, 6, 44, 0.92) 0%, rgba(10, 2, 22, 0.96) 100%)",
          backdropFilter: "blur(20px)",
          border: "2.5px solid #FF1361",
          borderRadius: 18,
          padding: "24px 38px",
          boxShadow:
            "0 0 30px rgba(255, 19, 97, 0.5), inset 0 0 15px rgba(139, 92, 246, 0.3)",
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "breaking-badge":
        return {
          background: "rgba(10, 10, 12, 0.94)",
          backdropFilter: "blur(20px)",
          borderLeft: `8px solid ${colors.highlightBg}`,
          borderTop: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderRight: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 12,
          padding: "22px 34px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
          marginBottom: 16,
          maxWidth: "96%",
        };

      case "minimal-pill":
        return {
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(255, 255, 255, 0.22)",
          borderRadius: 45,
          padding: "16px 36px",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.65)",
          marginBottom: 14,
          maxWidth: "92%",
        };

      case "card":
      default:
        return {
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)",
          backdropFilter: "blur(26px) saturate(190%)",
          border: `2px solid ${colors.borderColor || "rgba(255, 255, 255, 0.25)"}`,
          borderRadius: 30,
          padding: "24px 40px",
          boxShadow:
            "0 30px 65px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          marginBottom: 16,
          maxWidth: "96%",
        };
    }
  };

  // 3. Render Headline Words with Styles (Stickers, Cutouts, Highlighting, Cascade)
  const renderStyledHeadline = () => {
    const { headline } = caption;

    // Special Style: Magazine Cutout (Every single word looks like a collaged paper tag!)
    if (style === "magazine-cutout") {
      const words = headline.split(/\s+/);
      return (
        <span
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 12px",
            justifyContent:
              align === "left"
                ? "flex-start"
                : align === "right"
                ? "flex-end"
                : "center",
          }}
        >
          {words.map((word, index) => {
            const wordDelay = index * 3;
            const wordSpring = spring({
              frame: frame - wordDelay,
              fps,
              config: { damping: 11, mass: 0.5, stiffness: 180 },
            });

            // Alternate colors for collage cutout vibe
            const isAlt = index % 3;
            const bg =
              isAlt === 0
                ? "#FFFFFF"
                : isAlt === 1
                ? "#000000"
                : colors.highlightBg;
            const fg =
              isAlt === 0
                ? "#000000"
                : isAlt === 1
                ? "#FFFFFF"
                : colors.highlightTextColor;
            const wordTilt =
              index % 2 === 0 ? (index % 4 === 0 ? -3 : -1.5) : 2.5;

            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  backgroundColor: bg,
                  color: fg,
                  padding: "6px 18px",
                  borderRadius: index % 2 === 0 ? 4 : 8,
                  fontWeight: 950,
                  fontSize: headlineFontSize * 0.95,
                  transform: `scale(${wordSpring}) rotate(${wordTilt}deg)`,
                  opacity: wordSpring,
                  boxShadow: "0 8px 18px rgba(0,0,0,0.65)",
                  letterSpacing: "0.5px",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      );
    }

    // Special Style: Word Cascade (TikTok viral sequential word-by-word reveal)
    if (animation === "cascade-words") {
      const words = headline.split(/\s+/);
      return (
        <span
          style={{
            display: "inline",
            lineHeight: 1.25,
          }}
        >
          {words.map((word, idx) => {
            const isHighlight = highlightWords.some(
              (hw) => hw.toLowerCase().includes(word.toLowerCase())
            );
            const wordSpring = spring({
              frame: frame - idx * 3,
              fps,
              config: { damping: 12, mass: 0.5, stiffness: 170 },
            });

            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  margin: "0 6px",
                  opacity: wordSpring,
                  transform: `translateY(${interpolate(
                    wordSpring,
                    [0, 1],
                    [20, 0]
                  )}px) scale(${interpolate(wordSpring, [0, 1], [0.85, 1])})`,
                  color: isHighlight ? colors.highlightBg : colors.textColor,
                  fontWeight: isHighlight ? 950 : 900,
                  textShadow:
                    isHighlight
                      ? `0 0 25px ${colors.glowColor}, 0 4px 8px #000000`
                      : "0 4px 0 #000000, 0 10px 25px rgba(0,0,0,0.9)",
                  WebkitTextStroke: isHighlight ? "1.5px #000000" : "2px #000000",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      );
    }

    // Standard high-impact word splitting with highlight detection
    if (!highlightWords || highlightWords.length === 0) {
      return (
        <span
          style={{
            color: colors.textColor,
            WebkitTextStroke:
              style === "cyber-neon" ? "1px #000" : "2.5px #000000",
            textShadow:
              style === "cyber-neon"
                ? `0 0 25px ${colors.glowColor}, 0 4px 8px #000`
                : "0 6px 0 #000000, 0 14px 32px rgba(0,0,0,0.95)",
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
        // High impact sticker / highlight block
        if (style === "kinetic-sticker") {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: colors.highlightBg,
                color: colors.highlightTextColor,
                padding: "6px 22px",
                borderRadius: 18,
                margin: "4px 8px",
                fontWeight: 950,
                boxShadow: `0 10px 30px ${colors.highlightBg}99, 0 5px 0 #000000`,
                transform: `rotate(${index % 2 === 0 ? -2.2 : 2.5}deg)`,
                letterSpacing: "0px",
                verticalAlign: "middle",
                border: "2.5px solid #000000",
              }}
            >
              {part}
            </span>
          );
        }

        if (style === "comic-pop") {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: "#FFDE03",
                color: "#000000",
                padding: "4px 18px",
                borderRadius: 14,
                margin: "2px 8px",
                fontWeight: 950,
                border: "3.5px solid #000000",
                boxShadow: "5px 5px 0px #000000",
                transform: "rotate(-2deg)",
                verticalAlign: "middle",
              }}
            >
              {part}
            </span>
          );
        }

        if (style === "cyber-neon") {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                color: colors.highlightBg,
                textShadow: `0 0 25px ${colors.highlightBg}, 0 0 50px ${colors.highlightBg}`,
                fontWeight: 950,
                letterSpacing: "2px",
                margin: "0 6px",
              }}
            >
              {part}
            </span>
          );
        }

        if (style === "editorial-luxury") {
          return (
            <span
              key={index}
              style={{
                fontStyle: "italic",
                color: colors.highlightBg,
                fontWeight: 900,
                textDecoration: "underline",
                textDecorationColor: colors.highlightBg,
                textUnderlineOffset: "8px",
                margin: "0 6px",
              }}
            >
              {part}
            </span>
          );
        }

        // Default vibrant sticker
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              backgroundColor: colors.highlightBg,
              color: colors.highlightTextColor,
              padding: "4px 18px",
              borderRadius: 14,
              margin: "0 8px",
              fontWeight: 950,
              boxShadow: `0 8px 24px ${colors.highlightBg}aa, 0 4px 0 rgba(0,0,0,0.35)`,
              transform: "rotate(-1.5deg)",
              letterSpacing: "0px",
              verticalAlign: "middle",
            }}
          >
            {part}
          </span>
        );
      }

      // Non-highlight text
      return (
        <span
          key={index}
          style={{
            color: colors.textColor,
            WebkitTextStroke:
              style === "cyber-neon" ? "1px #000000" : "2.5px #000000",
            textShadow:
              style === "cyber-neon"
                ? `0 0 20px ${colors.glowColor}, 0 4px 8px #000000`
                : "0 6px 0 #000000, 0 12px 30px rgba(0,0,0,0.9)",
          }}
        >
          {part}
        </span>
      );
    });
  };

  // 4. SubText Pill Styling
  const getSubTextStyle = (): React.CSSProperties => {
    switch (style) {
      case "comic-pop":
        return {
          backgroundColor: "#FF3B30",
          border: "3px solid #000000",
          borderRadius: 16,
          padding: "10px 28px",
          boxShadow: "4px 4px 0px #000000",
          color: "#FFFFFF",
        };

      case "cyber-neon":
        return {
          backgroundColor: "rgba(6, 11, 25, 0.9)",
          border: `1.5px solid ${colors.borderColor}`,
          borderRadius: 8,
          padding: "10px 28px",
          boxShadow: `0 0 20px ${colors.glowColor}`,
          color: colors.highlightBg,
          letterSpacing: "1px",
        };

      case "streetwear-brutal":
        return {
          backgroundColor: "#FAFF00",
          border: "3px solid #000000",
          borderRadius: 0,
          padding: "10px 24px",
          boxShadow: "5px 5px 0px #000000",
          color: "#000000",
        };

      case "editorial-luxury":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(18px)",
          borderBottom: `2px solid ${colors.highlightBg}`,
          borderRadius: 12,
          padding: "10px 32px",
          color: "#FFFFFF",
          fontStyle: "italic",
        };

      case "floating-ghost":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(16px)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: 50,
          padding: "12px 34px",
          color: "#FFFFFF",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.8)",
        };

      default:
        return {
          backgroundColor: colors.subTextBg,
          backdropFilter: "blur(16px)",
          border: `2px solid ${colors.highlightBg}`,
          borderRadius: 50,
          padding: "12px 34px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
          color: colors.subTextColor,
        };
    }
  };

  return (
    <div style={getContainerPosition()}>
      {/* Optional Top Kicker / Mini-Badge */}
      {badgeText && (
        <div
          style={{
            transform: `translateY(${interpolate(
              mainSpring,
              [0, 1],
              [-15, 0]
            )}px) scale(${mainSpring})`,
            opacity: mainSpring,
            backgroundColor: colors.highlightBg,
            color: colors.highlightTextColor,
            padding: "6px 20px",
            borderRadius: style === "streetwear-brutal" ? 0 : 30,
            fontSize: 22,
            fontWeight: 950,
            letterSpacing: "1px",
            marginBottom: 12,
            boxShadow: `0 6px 20px ${colors.highlightBg}88`,
            border: "2px solid #000000",
            textTransform: "uppercase",
            fontFamily,
          }}
        >
          {badgeText}
        </div>
      )}

      {/* Main Headline Wrapper (if headline is present) */}
      {caption.headline && caption.headline.trim().length > 0 && (
        <div
          style={{
            transform: `${entranceTransform} translateY(${floatY}px) rotate(${tiltDeg}deg) scale(${pulseScale})`,
            opacity: entranceOpacity,
            ...getWrapperStyle(),
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: headlineFontSize,
              fontWeight: 950,
              lineHeight: 1.2,
              letterSpacing:
                style === "cyber-neon"
                  ? "1.5px"
                  : style === "editorial-luxury"
                  ? "1.2px"
                  : "0.5px",
              fontFamily,
              textTransform:
                style === "editorial-luxury" ? "none" : "uppercase",
            }}
          >
            {renderStyledHeadline()}
          </h1>
        </div>
      )}

      {/* Voiceover Subtitle / Read-Along SubText */}
      {(caption.subtitle || caption.subText || fallbackSubtitle) && (
        <div
          style={{
            transform: `translateY(${interpolate(
              subSpring,
              [0, 1],
              [24, 0]
            )}px)`,
            opacity: subSpring,
            maxWidth: "92%",
            ...getSubTextStyle(),
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: subTextFontSize,
              fontWeight: 800,
              lineHeight: 1.35,
              fontFamily,
              letterSpacing: "0.3px",
              textAlign: align,
            }}
          >
            {caption.subtitle ?? caption.subText ?? fallbackSubtitle}
          </p>
        </div>
      )}
    </div>
  );
};
