import { ContributionDay } from "./types.ts";
import h from "./tag.ts";

const svgID = "deno-github-contributions-graph";

// const weeks = 53;
// const days = 7;
const rectSize = 10;
const rectSpan = 3;
const rectRadius = 2;
const rectStep = rectSize + rectSpan;

const rectStyle = `#${svgID} .pixel {
  width: ${rectSize}px;
  height: ${rectSize}px;
  rx: ${rectRadius}px;
  ry: ${rectRadius}px;
  stroke: rgba(27,31,35,0.06);
  stroke-width: 2px;
}`;

const rect = (x: number, y: number, day: ContributionDay): string =>
  h("rect", {
    class: `pixel ${day.contributionLevel}`,
    x: x * rectStep,
    y: y * rectStep,
    "data-date": day.date,
    "data-count": day.contributionCount,
  });

export class Svg {
  static render(
    weeks: { contributionDays: ContributionDay[] }[],
    colors: string[],
  ): string {
    const width = 722;
    const height = 112;

    return h(
      "svg",
      { width, height, xmlns: "http://www.w3.org/2000/svg", id: svgID },
      h(
        "style",
        {},
        rectStyle,
        ...colors.map((color, idx) => `#${svgID} .l${idx} { fill: ${color}; }`),
      ),
      h(
        "g",
        { transform: `translate(${10}, ${20})` },
        weeks[0].contributionDays.map((_, i) =>
          weeks.map((row, j) => rect(j, i, row.contributionDays[i])).join("")
        ).join(),
      ),
    );
  }
}
