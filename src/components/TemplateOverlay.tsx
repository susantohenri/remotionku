import React from "react";
import { AbsoluteFill } from "remotion";

// Ambient / Background FX
import Starfield from "../templates/starfield";
import BokehCircles from "../templates/bokeh-circles";
import MatrixRain from "../templates/matrix-rain";
import FilmBurn from "../templates/film-burn";
import NoiseGrain from "../templates/noise-grain";
import GridPulse from "../templates/grid-pulse";
import ParticleExplosion from "../templates/particle-explosion";
import LiquidWave from "../templates/liquid-wave";
import GeometricPatterns from "../templates/geometric-patterns";
import VignettePulse from "../templates/vignette-pulse";
import SoundWave from "../templates/sound-wave";

// Foreground / Showcase Cards & UI
import StatCounter from "../templates/stat-counter";
import NotificationPop from "../templates/notification-pop";
import CameraShake from "../templates/camera-shake";
import CardFlip from "../templates/card-flip";
import ComparisonChart from "../templates/comparison-chart";
import ProgressBars from "../templates/progress-bars";
import CircularProgress from "../templates/circular-progress";
import QuoteCard from "../templates/quote-card";
import CountdownTimer from "../templates/countdown-timer";

// Text Animations
import GlitchText from "../templates/glitch-text";
import BubblePopText from "../templates/bubble-pop-text";
import PoppingText from "../templates/popping-text";
import BounceText from "../templates/bounce-text";
import FloatingBubbleText from "../templates/floating-bubble-text";

export const TemplateOverlay: React.FC<{
  templateName?: string;
}> = ({ templateName }) => {
  if (!templateName || templateName === "none") {
    return null;
  }

  const name = templateName.toLowerCase().trim();

  // 1. Ambient & Background FX (Composited over video/image)
  const isAmbient = [
    "starfield",
    "bokeh-circles",
    "matrix-rain",
    "film-burn",
    "noise-grain",
    "grid-pulse",
    "particle-explosion",
    "liquid-wave",
    "geometric-patterns",
    "vignette-pulse",
    "sound-wave",
  ].includes(name);

  if (isAmbient) {
    return (
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: name === "noise-grain" ? "overlay" : "screen",
          opacity: 0.85,
          zIndex: 15,
        }}
      >
        {name === "starfield" && <Starfield />}
        {name === "bokeh-circles" && <BokehCircles />}
        {name === "matrix-rain" && <MatrixRain />}
        {name === "film-burn" && <FilmBurn />}
        {name === "noise-grain" && <NoiseGrain />}
        {name === "grid-pulse" && <GridPulse />}
        {name === "particle-explosion" && <ParticleExplosion />}
        {name === "liquid-wave" && <LiquidWave />}
        {name === "geometric-patterns" && <GeometricPatterns />}
        {name === "vignette-pulse" && <VignettePulse />}
        {name === "sound-wave" && <SoundWave />}
      </AbsoluteFill>
    );
  }

  // 2. Foreground Feature & Metric Showcases
  const isShowcase = [
    "stat-counter",
    "notification-pop",
    "camera-shake",
    "card-flip",
    "comparison-chart",
    "progress-bars",
    "circular-progress",
    "quote-card",
    "countdown-timer",
  ].includes(name);

  if (isShowcase) {
    return (
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 22,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          maxWidth: 900,
          pointerEvents: "none",
        }}
      >
        {name === "stat-counter" && <StatCounter />}
        {name === "notification-pop" && <NotificationPop />}
        {name === "camera-shake" && <CameraShake />}
        {name === "card-flip" && <CardFlip />}
        {name === "comparison-chart" && <ComparisonChart />}
        {name === "progress-bars" && <ProgressBars />}
        {name === "circular-progress" && <CircularProgress />}
        {name === "quote-card" && <QuoteCard />}
        {name === "countdown-timer" && <CountdownTimer />}
      </div>
    );
  }

  // 3. Text Special Motion FX
  const isTextFx = [
    "glitch-text",
    "bubble-pop-text",
    "popping-text",
    "bounce-text",
    "floating-bubble-text",
  ].includes(name);

  if (isTextFx) {
    return (
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {name === "glitch-text" && <GlitchText />}
        {name === "bubble-pop-text" && <BubblePopText />}
        {name === "popping-text" && <PoppingText />}
        {name === "bounce-text" && <BounceText />}
        {name === "floating-bubble-text" && <FloatingBubbleText />}
      </div>
    );
  }

  return null;
};
