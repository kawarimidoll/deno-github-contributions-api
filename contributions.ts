import { ky, rgb24 } from "./deps.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";

// https://lab.syncer.jp/Web/JavaScript/Snippet/61/
const hexToRgb = (hex: string) => {
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3) {
    hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) +
      hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
  }

  const r = parseInt("0x" + hex.slice(0, 2));
  const g = parseInt("0x" + hex.slice(2, 4));
  const b = parseInt("0x" + hex.slice(4, 6));

  return { r, g, b };
};

const userName = "hayd";

const query = `
 query($userName:String!) {
   user(login: $userName){
     contributionsCollection {
       contributionCalendar {
         totalContributions
         weeks {
           contributionDays {
             color
             contributionCount
             contributionLevel
             date
           }
         }
       }
     }
   }
 }
 `;
const variables = `
 {
   "userName": "${userName}"
 }
 `;

const url = "https://api.github.com/graphql";

const json = { query, variables };

const { data } = await ky.post(url, {
  headers: { Authorization: `Bearer ${GITHUB_READ_USER_TOKEN}` },
  json,
}).json();

interface ContributionDay {
  contributionCount: number;
  contributionLevel: string;
  date: string;
  color: string;
}

const { weeks, totalContributions }: {
  weeks: { contributionDays: ContributionDay[] }[];
  totalContributions: number;
} = data?.user?.contributionsCollection
  ?.contributionCalendar;

if (!weeks || !totalContributions) {
  throw new Error("Could not get contributions data");
}

console.log(totalContributions + " contributions in the last year");

// console.log(weeks[weeks.length - 1]);
// console.log(weeks.slice(weeks.length - 7));

// [williambelle/github-contribution-color-graph: Change colors of contribution graph in GitHub.](https://github.com/williambelle/github-contribution-color-graph)
const github = ["#9be9a8", "#40c463", "#30a14e", "#216e39"];
const halloween = ["#fdf156", "#ffc722", "#ff9711", "#04001b"];
const amber = ["#ffecb3", "#ffd54f", "#ffb300", "#ff6f00"];
const blue = ["#bbdefb", "#64b5f6", "#1e88e5", "#0d47a1"];
const bluegrey = ["#cfd8dc", "#90a4ae", "#546e7a", "#263238"];
const brown = ["#d7ccc8", "#a1887f", "#6d4c41", "#3e2723"];
const cyan = ["#b2ebf2", "#4dd0e1", "#00acc1", "#006064"];
const deeporange = ["#ffccbc", "#ff8a65", "#f4511e", "#bf360c"];
const deeppurple = ["#d1c4e9", "#9575cd", "#5e35b1", "#311b92"];
const green = ["#c8e6c9", "#81c784", "#43a047", "#1b5e20"];
const grey = ["#e0e0e0", "#9e9e9e", "#616161", "#212121"];
const indigo = ["#c5cae9", "#7986cb", "#3949ab", "#1a237e"];
const lightblue = ["#b3e5fc", "#4fc3f7", "#039be5", "#01579b"];
const lightgreen = ["#dcedc8", "#aed581", "#7cb342", "#33691e"];
const lime = ["#f0f4c3", "#dce775", "#c0ca33", "#827717"];
const orange = ["#ffe0b2", "#ffb74d", "#fb8c00", "#e65100"];
const pink = ["#f8bbd0", "#f06292", "#e91e63", "#880e4f"];
const purple = ["#e1bee7", "#ba68c8", "#8e24aa", "#4a148c"];
const red = ["#ffcdd2", "#e57373", "#e53935", "#b71c1c"];
const teal = ["#b2dfdb", "#4db6ac", "#00897b", "#004d40"];
const yellowMd = ["#fff9c4", "#fff176", "#ffd835", "#f57f17"];
const unicorn = ["#6dc5fb", "#f6f68c", "#8affa4", "#f283d1"];
const summer = ["#eae374", "#f9d62e", "#fc913a", "#ff4e50"];
const sunset = ["#fed800", "#ff6f01", "#fd2f24", "#811d5e"];
const moon = ["#6bcdff", "#00a1f3", "#48009a", "#4f2266"];
const psychedelic = ["#faafe1", "#fb6dcc", "#fa3fbc", "#ff00ab"];
const yellow = ["#d7d7a2", "#d4d462", "#e0e03f", "#ffff00"];

const colorSchemes = {
  github,
  halloween,
  amber,
  blue,
  bluegrey,
  brown,
  cyan,
  deeporange,
  deeppurple,
  green,
  grey,
  indigo,
  lightblue,
  lightgreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellowMd,
  summer,
  unicorn,
  sunset,
  moon,
  psychedelic,
  yellow,
};
const colorSchemeName = "github";
const baseColor = "#eeeeee";

const fillPixel = (day?: ContributionDay) => {
  const colors = colorSchemes[colorSchemeName];
  switch (day?.contributionLevel) {
    case "FIRST_QUARTILE":
      return hexToRgb(colors[0]);
    case "SECOND_QUARTILE":
      return hexToRgb(colors[1]);
    case "THIRD_QUARTILE":
      return hexToRgb(colors[2]);
    case "FOURTH_QUARTILE":
      return hexToRgb(colors[3]);
  }
  // case "NONE" or undefined
  return hexToRgb(baseColor);
};

const grass = (day?: ContributionDay) =>
  day?.color ? rgb24("■", fillPixel(day)) : "";

weeks[0].contributionDays.forEach((_, i) => {
  console.log(
    weeks.map((row) => grass(row.contributionDays[i])).join(""),
  );
});
