export type CaptionPosition = 'bottom' | 'center' | 'top';
export type CaptionStyle = 'card' | 'kinetic-sticker' | 'minimal-pill';
export type CaptionSize = 'normal' | 'huge' | 'compact';

export type CaptionData = {
  headline: string;
  subText?: string;
  highlightWords?: string[];
  position?: CaptionPosition;
  style?: CaptionStyle;
  size?: CaptionSize;
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
  /** Template / efek visual tambahan dari library templates (opsional) */
  overlayTemplate?: string;
};

export type ProjectAudioConfig = {
  voiceoverSrc: string;
  backgroundMusicSrc?: string;
  bgmVolume?: number;
};

export type ThemeConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
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
  theme?: ThemeConfig;
};

export type VideoSchema = {
  project: ProjectConfig;
  scenes: SceneData[];
};
