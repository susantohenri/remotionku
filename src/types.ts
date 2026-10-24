export type CaptionPlacement =
  | 'bottom'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'center-left'
  | 'center-right'
  | 'top'
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'split-diagonal'
  | 'auto';

export type CaptionPosition = CaptionPlacement;

export type CaptionStyle =
  | 'auto'
  | 'kinetic-sticker'      // Vibrant TikTok tilted highlighter tapes per word/block
  | 'cyber-neon'            // Neon glowing HUD, brackets, cyan/magenta electric glow
  | 'comic-pop'              // Retro pop-art comic bubble, heavy 4px black borders & offset shadow
  | 'streetwear-brutal'     // Raw brutalist caution style, high contrast, sharp angles, bold warning
  | 'editorial-luxury'      // Elegant editorial magazine typography, serif/geometric, italic flair
  | 'magazine-cutout'       // Ransom collage paper cutout tags, alternating black/white/color rotated blocks
  | 'floating-ghost'        // Floating massive 3D text without box wrapper, ultra-cinematic
  | 'gradient-glass'        // Frosted liquid glassmorphism, iridescent gradient borders
  | 'retro-synthwave'       // 80s synthwave arcade, neon scanline gradient
  | 'breaking-badge'        // Breaking news urgent ticker / kicker badge style
  | 'minimal-pill'          // Modern floating rounded pill badge
  | 'card';                 // Enhanced card with dynamic accent borders & gradients

export type CaptionAnimation =
  | 'pop'                   // Bouncy punchy spring
  | 'slam'                  // Giant scale-down action impact slam
  | 'whip'                  // Fast slide-in whip pan with momentum
  | 'cascade-words'         // Words pop in sequentially with voice rhythm
  | 'glitch'                // Chromatic aberration glitch flicker
  | 'typewriter'            // Fast typing reveal
  | 'float-gentle';         // Ambient breathing float

export type CaptionFontTheme =
  | 'heavy'                 // Montserrat 950 / Impact / Arial Black
  | 'gaming'                // Orbitron / Chakra Petch
  | 'modern-sans'           // Space Grotesk / Outfit / Inter
  | 'editorial'             // Playfair Display / Cinzel / Georgia
  | 'condensed'             // Bebas Neue / Oswald
  | 'marker';               // Permanent Marker / Comic

export type CaptionSize = 'ultra' | 'huge' | 'normal' | 'compact';

export type CaptionCustomColors = {
  text?: string;
  highlightBg?: string;
  highlightText?: string;
  wrapperBg?: string;
  border?: string;
  glow?: string;
  subTextBg?: string;
  subTextColor?: string;
};

export type CaptionData = {
  headline: string;
  subText?: string;
  highlightWords?: string[];
  position?: CaptionPosition;
  placement?: CaptionPlacement;
  style?: CaptionStyle;
  size?: CaptionSize;
  animation?: CaptionAnimation;
  fontTheme?: CaptionFontTheme;
  badgeText?: string;       // E.g. "🔥 PRO TIP", "🎮 NEW UPDATE", "⚡ 100% FREE", "👀 WATCH THIS"
  tiltDeg?: number;         // Manual rotation angle e.g. -3 to 3 deg
  align?: 'left' | 'center' | 'right';
  customColors?: CaptionCustomColors;
  glow?: boolean;
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
