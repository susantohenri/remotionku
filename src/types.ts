export type CaptionData = {
  headline: string;
  subText?: string;
  highlightWords?: string[];
};

export type SceneData = {
  id: string;
  name: string;
  startFrame: number;
  durationInFrames: number;
  durationInSeconds: number;
  imageSrc: string;
  videoSrc?: string;
  /** Frame awal (relatif scene) video mulai tampil; sebelum ini imageSrc yang tampil. Default 0. */
  videoStartFrame?: number;
  /** Jumlah frame video background yang ditampilkan; setelah ini fallback ke imageSrc */
  videoDurationInFrames?: number;
  transitionType?: 'fade' | 'slide-left' | 'zoom-in' | string;
  caption?: CaptionData;
  voiceoverScript?: string;
  badge?: string;
};

export type ProjectAudioConfig = {
  voiceoverSrc: string;
  backgroundMusicSrc?: string;
  bgmVolume?: number;
};

export type ProjectConfig = {
  title: string;
  fps: number;
  width: number;
  height: number;
  totalDurationInFrames: number;
  websiteUrl: string;
  audio: ProjectAudioConfig;
  appName?: string;
  appBadge?: string;
  ctaHeadline?: string;
  ctaSubline?: string;
  storeBadge?: string;
};

export type VideoSchema = {
  project: ProjectConfig;
  scenes: SceneData[];
};
