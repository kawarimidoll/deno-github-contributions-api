import { hexStrToHexNum } from "./utils.ts";
import {
  CONTRIBUTION_LEVELS,
  type ContributionLevelName,
  isValidContributionLevelName,
} from "./contributions.ts";

/** A hex color string (e.g. `"#ff0000"`). */
type HexColor = `#${string}`;

/** A 5-element tuple of hex colors representing NONE through FOURTH_QUARTILE contribution levels. */
type ColorSchemeColors = [HexColor, HexColor, HexColor, HexColor, HexColor];

/** Name of an available color scheme. */
// NOTE: Defined explicitly because JSR requires explicit types for public API symbols.
// When adding a new color scheme, add its name here too.
type ColorSchemeName =
  | "github"
  | "halloween"
  | "amber"
  | "blue"
  | "bluegrey"
  | "brown"
  | "cyan"
  | "deeporange"
  | "deeppurple"
  | "green"
  | "grey"
  | "indigo"
  | "lightblue"
  | "lightgreen"
  | "lime"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellowMd"
  | "unicorn"
  | "summer"
  | "sunset"
  | "moon"
  | "psychedelic"
  | "yellow"
  | "gameboy";

/** Mapping of all available color scheme names to their 5-level hex color arrays. */
const COLOR_SCHEMES: Record<ColorSchemeName, ColorSchemeColors> = {
  // by [williambelle/github-contribution-color-graph](https://github.com/williambelle/github-contribution-color-graph)
  github: ["#eeeeee", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  halloween: ["#eeeeee", "#fdf156", "#ffc722", "#ff9711", "#04001b"],
  amber: ["#eeeeee", "#ffecb3", "#ffd54f", "#ffb300", "#ff6f00"],
  blue: ["#eeeeee", "#bbdefb", "#64b5f6", "#1e88e5", "#0d47a1"],
  bluegrey: ["#eeeeee", "#cfd8dc", "#90a4ae", "#546e7a", "#263238"],
  brown: ["#eeeeee", "#d7ccc8", "#a1887f", "#6d4c41", "#3e2723"],
  cyan: ["#eeeeee", "#b2ebf2", "#4dd0e1", "#00acc1", "#006064"],
  deeporange: ["#eeeeee", "#ffccbc", "#ff8a65", "#f4511e", "#bf360c"],
  deeppurple: ["#eeeeee", "#d1c4e9", "#9575cd", "#5e35b1", "#311b92"],
  green: ["#eeeeee", "#c8e6c9", "#81c784", "#43a047", "#1b5e20"],
  grey: ["#eeeeee", "#e0e0e0", "#9e9e9e", "#616161", "#212121"],
  indigo: ["#eeeeee", "#c5cae9", "#7986cb", "#3949ab", "#1a237e"],
  lightblue: ["#eeeeee", "#b3e5fc", "#4fc3f7", "#039be5", "#01579b"],
  lightgreen: ["#eeeeee", "#dcedc8", "#aed581", "#7cb342", "#33691e"],
  lime: ["#eeeeee", "#f0f4c3", "#dce775", "#c0ca33", "#827717"],
  orange: ["#eeeeee", "#ffe0b2", "#ffb74d", "#fb8c00", "#e65100"],
  pink: ["#eeeeee", "#f8bbd0", "#f06292", "#e91e63", "#880e4f"],
  purple: ["#eeeeee", "#e1bee7", "#ba68c8", "#8e24aa", "#4a148c"],
  red: ["#eeeeee", "#ffcdd2", "#e57373", "#e53935", "#b71c1c"],
  teal: ["#eeeeee", "#b2dfdb", "#4db6ac", "#00897b", "#004d40"],
  yellowMd: ["#eeeeee", "#fff9c4", "#fff176", "#ffd835", "#f57f17"],
  unicorn: ["#eeeeee", "#6dc5fb", "#f6f68c", "#8affa4", "#f283d1"],
  summer: ["#eeeeee", "#eae374", "#f9d62e", "#fc913a", "#ff4e50"],
  sunset: ["#eeeeee", "#fed800", "#ff6f01", "#fd2f24", "#811d5e"],
  moon: ["#eeeeee", "#6bcdff", "#00a1f3", "#48009a", "#4f2266"],
  psychedelic: ["#eeeeee", "#faafe1", "#fb6dcc", "#fa3fbc", "#ff00ab"],
  yellow: ["#eeeeee", "#d7d7a2", "#d4d462", "#e0e03f", "#ffff00"],

  // by kawarimidoll
  gameboy: ["#eeeeee", "#ccdc5f", "#91a633", "#606520", "#2c370b"],
};

type ColorScheme = {
  hexStrColors: ColorSchemeColors;
  hexNumColors: number[];
  getByLevel: (levelName?: ContributionLevelName) => number;
};

/**
 * Returns true if `name` is a valid color scheme name.
 */
function isValidColorSchemeName(name?: string): name is ColorSchemeName {
  return !!name && Object.hasOwn(COLOR_SCHEMES, name);
}

function randomColorScheme(): ColorSchemeColors {
  const values = Object.values(COLOR_SCHEMES);
  return values[(Math.random() * values.length) << 0];
}

/**
 * Returns the color scheme for the given name, or a random one if `"random"` is passed.
 */
function getColorScheme(name = "github"): ColorScheme {
  if (name !== "random" && !isValidColorSchemeName(name)) {
    throw new Error(
      `'${name}' is invalid color scheme name! Choose from: ${
        Object.keys(COLOR_SCHEMES)
      },random`,
    );
  }

  const hexStrColors = name === "random"
    ? randomColorScheme()
    : COLOR_SCHEMES[name];

  const hexNumColors = hexStrColors.map((color) => hexStrToHexNum(color));

  const getByLevel = (levelName?: ContributionLevelName): number =>
    hexNumColors[
      isValidContributionLevelName(levelName)
        ? CONTRIBUTION_LEVELS[levelName]
        : 0
    ];

  return { hexStrColors, hexNumColors, getByLevel };
}

export { COLOR_SCHEMES, getColorScheme, isValidColorSchemeName };
export type { ColorSchemeName };
