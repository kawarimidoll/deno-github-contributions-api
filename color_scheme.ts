import { hexToRgbNum } from "./utils.ts";
import { ContributionLevelName } from "./types.ts";

// [williambelle/github-contribution-color-graph: Change colors of contribution graph in GitHub.](https://github.com/williambelle/github-contribution-color-graph)
const COLOR_SCHEMES: { [key: string]: string[] } = {
  github: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
  halloween: ["#fdf156", "#ffc722", "#ff9711", "#04001b"],
  amber: ["#ffecb3", "#ffd54f", "#ffb300", "#ff6f00"],
  blue: ["#bbdefb", "#64b5f6", "#1e88e5", "#0d47a1"],
  bluegrey: ["#cfd8dc", "#90a4ae", "#546e7a", "#263238"],
  brown: ["#d7ccc8", "#a1887f", "#6d4c41", "#3e2723"],
  cyan: ["#b2ebf2", "#4dd0e1", "#00acc1", "#006064"],
  deeporange: ["#ffccbc", "#ff8a65", "#f4511e", "#bf360c"],
  deeppurple: ["#d1c4e9", "#9575cd", "#5e35b1", "#311b92"],
  green: ["#c8e6c9", "#81c784", "#43a047", "#1b5e20"],
  grey: ["#e0e0e0", "#9e9e9e", "#616161", "#212121"],
  indigo: ["#c5cae9", "#7986cb", "#3949ab", "#1a237e"],
  lightblue: ["#b3e5fc", "#4fc3f7", "#039be5", "#01579b"],
  lightgreen: ["#dcedc8", "#aed581", "#7cb342", "#33691e"],
  lime: ["#f0f4c3", "#dce775", "#c0ca33", "#827717"],
  orange: ["#ffe0b2", "#ffb74d", "#fb8c00", "#e65100"],
  pink: ["#f8bbd0", "#f06292", "#e91e63", "#880e4f"],
  purple: ["#e1bee7", "#ba68c8", "#8e24aa", "#4a148c"],
  red: ["#ffcdd2", "#e57373", "#e53935", "#b71c1c"],
  teal: ["#b2dfdb", "#4db6ac", "#00897b", "#004d40"],
  yellowMd: ["#fff9c4", "#fff176", "#ffd835", "#f57f17"],
  unicorn: ["#6dc5fb", "#f6f68c", "#8affa4", "#f283d1"],
  summer: ["#eae374", "#f9d62e", "#fc913a", "#ff4e50"],
  sunset: ["#fed800", "#ff6f01", "#fd2f24", "#811d5e"],
  moon: ["#6bcdff", "#00a1f3", "#48009a", "#4f2266"],
  psychedelic: ["#faafe1", "#fb6dcc", "#fa3fbc", "#ff00ab"],
  yellow: ["#d7d7a2", "#d4d462", "#e0e03f", "#ffff00"],

  gameboy: ["#ccdc5f", "#91a633", "#606520", "#2c370b"],
};
export type ColorSchemeName = keyof typeof COLOR_SCHEMES;

const baseColor = "#eeeeee";

const randomColorScheme = () => {
  const values = Object.values(COLOR_SCHEMES);
  return values[(Math.random() * values.length) << 0];
};

const getColorScheme = (name?: ColorSchemeName | "random") => {
  const hexColors = [
    baseColor,
    ...(name === "random"
      ? randomColorScheme()
      : COLOR_SCHEMES[name ?? "github"]),
  ];
  const colors = hexColors.map((color) => hexToRgbNum(color));

  const getByLevel = (levelName?: ContributionLevelName) => {
    switch (levelName) {
      case "FIRST_QUARTILE":
        return colors[1];
      case "SECOND_QUARTILE":
        return colors[2];
      case "THIRD_QUARTILE":
        return colors[3];
      case "FOURTH_QUARTILE":
        return colors[4];
    }
    // case "NONE" or undefined
    return colors[0];
  };

  return { hexColors, colors, getByLevel };
};

export { COLOR_SCHEMES, getColorScheme };
