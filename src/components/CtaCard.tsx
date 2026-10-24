import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThemeConfig } from "../types";

export const CtaCard: React.FC<{
  websiteUrl: string;
  ctaHeadline?: string;
  ctaSubline?: string;
  storeBadge?: string;
  theme?: ThemeConfig;
}> = ({ websiteUrl, ctaHeadline, ctaSubline, storeBadge, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance
  const entrance = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 12,
      mass: 0.8,
    },
  });

  // Gentle breathing / pulse effect after entrance
  const pulse = Math.sin((frame / 12) * Math.PI) * 0.03;

  // Pointer bounce
  const pointerBounce = Math.sin((frame / 8) * Math.PI) * 10;

  const primary = theme?.primaryColor ?? "#6366F1";
  const secondary = theme?.secondaryColor ?? "#4F46E5";
  const accent = theme?.accentColor ?? "#38BDF8";

  return (
    <div
      style={{
        position: "absolute",
        left: 45,
        right: 45,
        bottom: 170,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 25,
        transform: `translateY(${interpolate(
          entrance,
          [0, 1],
          [50, 0]
        )}px) scale(${entrance * (1 + pulse)})`,
        opacity: entrance,
      }}
    >
      {/* Main Website Callout Box */}
      <div
        style={{
          width: "100%",
          maxWidth: 940,
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          borderRadius: 28,
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: `0 20px 50px ${primary}80, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
          border: "2px solid rgba(255, 255, 255, 0.35)",
        }}
      >
        {/* Top small label */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            padding: "8px 24px",
            borderRadius: 20,
            color: accent,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.5px",
            marginBottom: 12,
            textTransform: "uppercase",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {ctaHeadline ?? "DOWNLOAD ON GOOGLE PLAY"}
        </div>

        {/* Big Website URL Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            backgroundColor: "#FFFFFF",
            padding: "16px 36px",
            borderRadius: 20,
            width: "92%",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          }}
        >
          <span style={{ fontSize: 36 }}>{storeBadge ?? "▶️"}</span>
          <span
            style={{
              color: primary,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: "0.5px",
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {websiteUrl.replace(/^https?:\/\//, "")}
          </span>
        </div>

        {/* Action Prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 14,
          }}
        >
          <span
            style={{
              transform: `translateY(${pointerBounce}px)`,
              fontSize: 32,
            }}
          >
            👉
          </span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 800,
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {ctaSubline ?? "Tersedia Gratis di Google Play Store!"}
          </span>
        </div>
      </div>
    </div>
  );
};
