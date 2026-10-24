import {
  CaptionAnimation,
  CaptionData,
  CaptionFontTheme,
  CaptionPlacement,
  CaptionStyle,
  ThemeConfig,
} from "../types";

export interface ResolvedCaptionConfig {
  placement: CaptionPlacement;
  style: CaptionStyle;
  animation: CaptionAnimation;
  fontTheme: CaptionFontTheme;
  headlineFontSize: number;
  subTextFontSize: number;
  tiltDeg: number;
  align: "left" | "center" | "right";
  colors: {
    textColor: string;
    highlightBg: string;
    highlightTextColor: string;
    wrapperBg: string;
    borderColor: string;
    glowColor: string;
    subTextBg: string;
    subTextColor: string;
  };
  badgeText?: string;
  highlightWords: string[];
}

// Preset color palettes for varied, unexpected aesthetics
const VIBRANT_PALETTES = [
  {
    // Neon Cyber
    textColor: "#FFFFFF",
    highlightBg: "#00F5FF",
    highlightTextColor: "#000000",
    wrapperBg: "rgba(10, 15, 30, 0.88)",
    borderColor: "#00F5FF",
    glowColor: "rgba(0, 245, 255, 0.6)",
    subTextBg: "rgba(0, 0, 0, 0.85)",
    subTextColor: "#00F5FF",
  },
  {
    // Comic Pop (High energy yellow / black)
    textColor: "#FFFFFF",
    highlightBg: "#FFDE03",
    highlightTextColor: "#000000",
    wrapperBg: "rgba(255, 255, 255, 0.96)",
    borderColor: "#000000",
    glowColor: "rgba(255, 222, 3, 0.5)",
    subTextBg: "#FF3B30",
    subTextColor: "#FFFFFF",
  },
  {
    // Streetwear / Brutal caution
    textColor: "#FAFF00",
    highlightBg: "#FAFF00",
    highlightTextColor: "#000000",
    wrapperBg: "#000000",
    borderColor: "#FAFF00",
    glowColor: "rgba(250, 255, 0, 0.45)",
    subTextBg: "#FAFF00",
    subTextColor: "#000000",
  },
  {
    // Luxury Editorial Gold
    textColor: "#FFFFFF",
    highlightBg: "#E5C07B",
    highlightTextColor: "#0F172A",
    wrapperBg: "rgba(15, 23, 42, 0.75)",
    borderColor: "rgba(229, 192, 123, 0.6)",
    glowColor: "rgba(229, 192, 123, 0.35)",
    subTextBg: "rgba(0, 0, 0, 0.8)",
    subTextColor: "#E5C07B",
  },
  {
    // Retro Synthwave Hot Pink & Purple
    textColor: "#FFFFFF",
    highlightBg: "#FF1493",
    highlightTextColor: "#FFFFFF",
    wrapperBg: "rgba(20, 5, 35, 0.9)",
    borderColor: "#FF1493",
    glowColor: "rgba(255, 20, 147, 0.7)",
    subTextBg: "#8B5CF6",
    subTextColor: "#FFFFFF",
  },
  {
    // Acid Green / Electric Mint
    textColor: "#FFFFFF",
    highlightBg: "#10B981",
    highlightTextColor: "#000000",
    wrapperBg: "rgba(6, 26, 20, 0.9)",
    borderColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    subTextBg: "rgba(0, 0, 0, 0.85)",
    subTextColor: "#34D399",
  },
];

// Fallback style cycle when style is 'auto' or omitted to guarantee no two adjacent scenes feel similar
const STYLE_CYCLE: CaptionStyle[] = [
  "kinetic-sticker",
  "cyber-neon",
  "comic-pop",
  "magazine-cutout",
  "streetwear-brutal",
  "editorial-luxury",
  "gradient-glass",
  "floating-ghost",
  "breaking-badge",
  "retro-synthwave",
];

// Fallback placement cycle to guarantee text doesn't stay stuck in the same place
const PLACEMENT_CYCLE: CaptionPlacement[] = [
  "center",
  "bottom-left",
  "top-right",
  "bottom-center",
  "center-right",
  "bottom-right",
  "top-left",
];

// Animation cycle
const ANIMATION_CYCLE: CaptionAnimation[] = [
  "slam",
  "whip",
  "pop",
  "cascade-words",
  "glitch",
  "pop",
  "float-gentle",
];

/**
 * Intelligent helper that auto-extracts high impact words if none are explicitly declared
 */
export const autoExtractHighlightWords = (headline: string): string[] => {
  const words = headline.trim().split(/\s+/);
  if (words.length <= 2) return words;

  // Pick words that have numbers, capital letters, or are short punchy words
  const prioritized = words.filter((w) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "");
    if (/\d/.test(clean)) return true;
    if (clean.length >= 4 && clean === clean.toUpperCase()) return true;
    return false;
  });

  if (prioritized.length > 0) {
    return prioritized.slice(0, 3);
  }

  // Fallback: pick the middle or first two words
  return words.slice(0, 2);
};

/**
 * Creative Text Director:
 * Resolves all typography, styling, animation, layout, and color parameters.
 * Gives complete freedom to AI, while providing diverse defaults if not specified.
 */
export const resolveCreativeCaption = (
  caption: CaptionData,
  sceneIndex: number,
  isHookScene: boolean,
  theme?: ThemeConfig
): ResolvedCaptionConfig => {
  // 1. Resolve Style
  let style: CaptionStyle;
  if (caption.style && caption.style !== "auto") {
    style = caption.style;
  } else if (isHookScene) {
    style = "kinetic-sticker";
  } else {
    style = STYLE_CYCLE[sceneIndex % STYLE_CYCLE.length];
  }

  // 2. Resolve Placement / Position
  let placement: CaptionPlacement;
  const userPlacement = caption.placement ?? caption.position;
  if (userPlacement && userPlacement !== "auto") {
    placement = userPlacement;
  } else if (isHookScene) {
    placement = "center";
  } else {
    placement = PLACEMENT_CYCLE[sceneIndex % PLACEMENT_CYCLE.length];
  }

  // 3. Resolve Alignment based on placement
  let align: "left" | "center" | "right" = caption.align ?? "center";
  if (!caption.align) {
    if (placement.includes("left")) align = "left";
    else if (placement.includes("right")) align = "right";
    else align = "center";
  }

  // 4. Resolve Animation
  let animation: CaptionAnimation;
  if (caption.animation) {
    animation = caption.animation;
  } else if (isHookScene) {
    animation = "slam";
  } else if (style === "cyber-neon") {
    animation = "glitch";
  } else if (style === "magazine-cutout") {
    animation = "cascade-words";
  } else {
    animation = ANIMATION_CYCLE[sceneIndex % ANIMATION_CYCLE.length];
  }

  // 5. Resolve Font Theme
  let fontTheme: CaptionFontTheme;
  if (caption.fontTheme) {
    fontTheme = caption.fontTheme;
  } else {
    switch (style) {
      case "cyber-neon":
        fontTheme = "gaming";
        break;
      case "editorial-luxury":
        fontTheme = "editorial";
        break;
      case "comic-pop":
        fontTheme = "marker";
        break;
      case "streetwear-brutal":
        fontTheme = "condensed";
        break;
      case "magazine-cutout":
        fontTheme = "heavy";
        break;
      case "breaking-badge":
        fontTheme = "heavy";
        break;
      case "retro-synthwave":
        fontTheme = "gaming";
        break;
      default:
        fontTheme = isHookScene ? "heavy" : "modern-sans";
    }
  }

  // 6. Font Sizing
  const size = caption.size ?? (isHookScene ? "huge" : "normal");
  let headlineFontSize = 64;
  let subTextFontSize = 36;

  if (size === "ultra") {
    headlineFontSize = 96;
    subTextFontSize = 46;
  } else if (size === "huge") {
    headlineFontSize = 84;
    subTextFontSize = 40;
  } else if (size === "compact") {
    headlineFontSize = 48;
    subTextFontSize = 28;
  } else {
    headlineFontSize = 64;
    subTextFontSize = 34;
  }

  // For editorial style, scale font slightly for elegance
  if (fontTheme === "editorial") {
    headlineFontSize = Math.round(headlineFontSize * 0.95);
  }

  // 7. Tilt / Rotation Angle
  let tiltDeg = caption.tiltDeg ?? 0;
  if (caption.tiltDeg === undefined) {
    if (style === "kinetic-sticker") {
      tiltDeg = (sceneIndex % 2 === 0 ? -2.5 : 2.0);
    } else if (style === "comic-pop") {
      tiltDeg = -1.8;
    } else if (style === "streetwear-brutal") {
      tiltDeg = 1.5;
    }
  }

  // 8. Colors resolution
  const palette = VIBRANT_PALETTES[sceneIndex % VIBRANT_PALETTES.length];
  const custom = caption.customColors;

  const colors = {
    textColor: custom?.text ?? palette.textColor,
    highlightBg:
      custom?.highlightBg ?? (theme?.accentColor || palette.highlightBg),
    highlightTextColor:
      custom?.highlightText ?? palette.highlightTextColor,
    wrapperBg: custom?.wrapperBg ?? palette.wrapperBg,
    borderColor: custom?.border ?? palette.borderColor,
    glowColor: custom?.glow ?? palette.glowColor,
    subTextBg: custom?.subTextBg ?? palette.subTextBg,
    subTextColor: custom?.subTextColor ?? palette.subTextColor,
  };

  // 9. Highlights
  const highlightWords =
    caption.highlightWords && caption.highlightWords.length > 0
      ? caption.highlightWords
      : autoExtractHighlightWords(caption.headline);

  return {
    placement,
    style,
    animation,
    fontTheme,
    headlineFontSize,
    subTextFontSize,
    tiltDeg,
    align,
    colors,
    badgeText: caption.badgeText,
    highlightWords,
  };
};

/**
 * Returns CSS font family stack based on the font theme
 */
export const getFontFamilyStack = (fontTheme: CaptionFontTheme): string => {
  switch (fontTheme) {
    case "gaming":
      return '"Orbitron", "Chakra Petch", "Rajdhani", monospace, sans-serif';
    case "editorial":
      return '"Playfair Display", "Cinzel", "Georgia", serif';
    case "condensed":
      return '"Bebas Neue", "Oswald", "Teko", "Impact", sans-serif';
    case "marker":
      return '"Permanent Marker", "Comic Sans MS", cursive, sans-serif';
    case "modern-sans":
      return '"Space Grotesk", "Outfit", "Inter", -apple-system, sans-serif';
    case "heavy":
    default:
      return '"Montserrat", "Arial Black", "Impact", -apple-system, sans-serif';
  }
};
