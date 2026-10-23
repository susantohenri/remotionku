import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const HeaderBar: React.FC<{
  sceneIndex: number;
  totalScenes: number;
  sceneName: string;
  badge?: string;
  websiteUrl: string;
  appName?: string;
  appBadge?: string;
}> = ({ sceneIndex, totalScenes, sceneName, badge, websiteUrl, appName, appBadge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 35,
        transform: `translateY(${interpolate(entrance, [0, 1], [-50, 0])}px)`,
        opacity: entrance,
      }}
    >
      {/* Brand Tag with Glow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)", // Brand Fire Gradient
          padding: "12px 24px",
          borderRadius: 40,
          boxShadow: "0 8px 30px rgba(234, 88, 12, 0.6)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <span style={{ fontSize: 26 }}>{appBadge ?? "📱"}</span>
        <span
          style={{
            color: "#FFFFFF",
            fontWeight: 950,
            fontSize: 26,
            letterSpacing: "1px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {appName ?? "APP PROMO"}
        </span>
      </div>

      {/* Website URL Watermark Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(16px)",
          border: "2px solid rgba(250, 204, 21, 0.7)", // Gold frame
          padding: "10px 24px",
          borderRadius: 40,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span style={{ fontSize: 22 }}>🌐</span>
        <span
          style={{
            color: "#FACC15",
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: "0.5px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
            textShadow: "0 2px 10px rgba(250, 204, 21, 0.4)",
          }}
        >
          {websiteUrl.replace(/^https?:\/\//, "")}
        </span>
      </div>

      {/* Step / Scene / Hook Badge */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(14px)",
          border: "2px solid rgba(255, 255, 255, 0.25)",
          padding: "10px 24px",
          borderRadius: 40,
          color: "#FFFFFF",
          fontSize: 22,
          fontWeight: 900,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Montserrat", "Segoe UI", Roboto, sans-serif',
          textTransform: "uppercase",
        }}
      >
        {badge
          ? badge
          : sceneIndex === 0
          ? `✨ ${sceneName.toUpperCase()}`
          : sceneIndex === totalScenes - 1
          ? `📲 ${sceneName.toUpperCase()}`
          : `LANGKAH ${sceneIndex} / ${totalScenes - 2}`}
      </div>
    </div>
  );
};
