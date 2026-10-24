import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SceneData, VideoSchema } from "../types";
import { CaptionOverlay } from "./CaptionOverlay";
import { CtaCard } from "./CtaCard";
import { TemplateOverlay } from "./TemplateOverlay";

export const SceneSlide: React.FC<{
  scene: SceneData;
  sceneIndex: number;
  totalScenes: number;
  websiteUrl: string;
  data: VideoSchema;
}> = ({ scene, sceneIndex, totalScenes, websiteUrl, data }) => {
  const frame = useCurrentFrame();

  // Ken Burns subtle zoom (used for background)
  const zoomScale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [1.0, 1.08],
    { extrapolateRight: "clamp" }
  );

  // Subtle pan
  const panY = interpolate(
    frame,
    [0, scene.durationInFrames],
    [0, -15],
    { extrapolateRight: "clamp" }
  );

  // Entrance transition handling
  let transitionStyle: React.CSSProperties = {};

  if (scene.transitionType === "slide-left") {
    const slideOffset = interpolate(frame, [0, 14], [100, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(frame, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    });
    transitionStyle = {
      transform: `translateX(${slideOffset}px)`,
      opacity,
    };
  } else if (scene.transitionType === "zoom-in") {
    const zoomInScale = interpolate(frame, [0, 16], [0.9, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(frame, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    });
    transitionStyle = {
      transform: `scale(${zoomInScale})`,
      opacity,
    };
  } else {
    // Default 'fade'
    const opacity = interpolate(frame, [0, 12], [0, 1], {
      extrapolateRight: "clamp",
    });
    transitionStyle = { opacity };
  }

  // Exit transition (fade out during the last 6 frames)
  const exitOpacity = interpolate(
    frame,
    [scene.durationInFrames - 6, scene.durationInFrames],
    [1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isLastScene = sceneIndex === totalScenes - 1 || scene.id.endsWith("-cta") || scene.id.includes("cta");
  const isHookScene = sceneIndex === 0 || scene.id.includes("hook");

  // Video background check
  const videoStart = scene.videoStartFrame ?? 0;
  const hasVideoBackground =
    Boolean(scene.videoSrc) &&
    frame >= videoStart &&
    (scene.videoDurationInFrames === undefined ||
      frame - videoStart < scene.videoDurationInFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        overflow: "hidden",
        ...transitionStyle,
        opacity:
          (typeof transitionStyle.opacity === "number"
            ? transitionStyle.opacity
            : 1) * exitOpacity,
      }}
    >
      {/* Background: AI Video if videoSrc provided, otherwise Still Image with Ken Burns */}
      {hasVideoBackground && scene.videoSrc ? (
        <Sequence from={videoStart} layout="none">
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${zoomScale}) translateY(${panY}px)`,
              transformOrigin: "center center",
            }}
          >
            <OffthreadVideo
              src={staticFile(scene.videoSrc)}
              volume={0}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </Sequence>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoomScale}) translateY(${panY}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={staticFile(scene.imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Cinematic Gradient Overlays */}
      <AbsoluteFill
        style={{
          background: hasVideoBackground
            ? "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.5) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Dynamic Visual Template / Overlay Effect */}
      <TemplateOverlay templateName={scene.overlayTemplate} />

      {/* Dynamic Caption Overlay */}
      {scene.caption?.headline && (
        <CaptionOverlay
          caption={scene.caption}
          bottomOffset={isLastScene ? 450 : 340}
          theme={data.project.theme}
          isHookScene={isHookScene}
        />
      )}

      {/* Dedicated End CTA Card on Last Scene */}
      {isLastScene && (
        <CtaCard
          websiteUrl={websiteUrl}
          ctaHeadline={data.project.ctaHeadline}
          ctaSubline={data.project.ctaSubline}
          storeBadge={data.project.storeBadge}
          theme={data.project.theme}
        />
      )}
    </AbsoluteFill>
  );
};
