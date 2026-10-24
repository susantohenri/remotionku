import React from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  staticFile,
} from "remotion";
import { VideoSchema } from "./types";
import { SceneSlide } from "./components/SceneSlide";
import { ProgressBar } from "./components/ProgressBar";

export const ContentVideo: React.FC<{ data: VideoSchema }> = ({ data }) => {
  const { project, scenes } = data;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* High-Personality Modern & Expressive Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@700;900&family=Outfit:wght@700;900&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@700&display=swap');
        `}
      </style>

      {/* Voiceover Audio runs continuously throughout the entire video */}
      <Audio
        src={staticFile(project.audio.voiceoverSrc)}
        volume={1.0}
      />

      {/* Sequential Scenes */}
      <Series>
        {scenes.map((scene, index) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            name={scene.name}
          >
            <SceneSlide
              scene={scene}
              sceneIndex={index}
              totalScenes={scenes.length}
              websiteUrl={project.websiteUrl}
              data={data}
            />
          </Series.Sequence>
        ))}
      </Series>

      {/* Global Video Progress Indicator */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
