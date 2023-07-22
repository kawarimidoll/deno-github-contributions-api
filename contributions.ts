import { getColorScheme } from "./color_scheme.ts";
import { bgRgb24, h, ky, rgb24, stringWidth } from "./deps.ts";
import { confirmHex, convertToSixChars } from "./utils.ts";

type ContributionDay = {
  contributionCount: number;
  contributionLevel: ContributionLevelName;
  date: string;
  color: string;
};

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};
type ContributionLevelName = keyof typeof CONTRIBUTION_LEVELS;

const isValidContributionLevelName = (
  name?: string,
): name is ContributionLevelName =>
  !!name && Object.hasOwn(CONTRIBUTION_LEVELS, name);

type ContributionOptions = {
  from?: string;
  to?: string;
};

type ContributionResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: ContributionDay[];
          }[];
        };
      };
    };
  };
};

const getContributionCalendar = async (
  userName: string,
  token: string,
  contributionOptions: ContributionOptions = {},
) => {
  if (!userName || !token) {
    throw new Error("Missing required arguments");
  }
  const { from, to } = contributionOptions;

  const query = `
 query($userName:String! $from:DateTime $to:DateTime) {
   user(login: $userName){
     contributionsCollection(from: $from, to: $to) {
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
  const variables = JSON.stringify({ userName, from, to });

  const json = { query, variables };
  const url = "https://api.github.com/graphql";
  const { data } = await ky.post(url, {
    headers: { Authorization: `Bearer ${token}` },
    json,
  }).json() as ContributionResponse;

  const contributionCalendar = data?.user?.contributionsCollection
    ?.contributionCalendar;

  if (
    !contributionCalendar || !Object.hasOwn(contributionCalendar, "weeks") ||
    !Object.hasOwn(contributionCalendar, "totalContributions")
  ) {
    throw new Error("Could not get contributions data");
  }

  const { weeks, totalContributions }: {
    weeks: { contributionDays: ContributionDay[] }[];
    totalContributions: number;
  } = contributionCalendar;

  const contributions = weeks.map((week) => week.contributionDays);

  return { contributions, totalContributions };
};

const totalMsg = (totalNum: number): string =>
  totalNum + " contributions in the last year\n";

const moreContributionDay = (a: ContributionDay, b: ContributionDay) =>
  a.contributionCount > b.contributionCount ? a : b;

const getMaxContributionDay = (
  contributions: ContributionDay[][],
): ContributionDay =>
  contributions.reduce(
    (max, week) =>
      moreContributionDay(
        max,
        week.reduce(
          (maxInWeek, current) => moreContributionDay(maxInWeek, current),
          week[0],
        ),
      ),
    contributions[0][0],
  );

const contributionsToJson = (
  contributions: ContributionDay[][],
  totalContributions: number,
  {
    flat = false,
  } = {},
) =>
  JSON.stringify({
    contributions: flat ? contributions.flat() : contributions,
    totalContributions,
  });

const contributionsToTerm = (
  contributions: ContributionDay[][],
  totalContributions: number,
  {
    noTotal = false,
    noLegend = false,
    scheme = "github",
    pixel = "■",
    invert = false,
  } = {},
) => {
  const pixelWidth = stringWidth(pixel);
  if (pixelWidth > 2) {
    // width == 2 is ok
    // like as "[]", "草", " "
    throw new Error(`Pixel '${pixel}' is too long. Max width of pixel is 2.`);
  }

  const colorScheme = getColorScheme(scheme);

  const total = !noTotal ? totalMsg(totalContributions) : "";

  // 10 is length of 'Less  More'
  // 5 is count of colored pixels as legend
  const legendOffset = " ".repeat(
    (contributions.length - 5) * pixelWidth - 10,
  );

  const legend = !noLegend
    ? legendOffset +
      "Less " + colorScheme.hexNumColors.map((color) =>
        invert ? bgRgb24(pixel, color) : rgb24(pixel, color)
      ).join("") + " More\n"
    : "";

  const grass = (day?: ContributionDay) =>
    day?.contributionLevel
      ? invert
        ? bgRgb24(pixel, colorScheme.getByLevel(day?.contributionLevel))
        : rgb24(pixel, colorScheme.getByLevel(day?.contributionLevel))
      : "";

  return total +
    contributions[0].reduce(
      (acc, _, i) =>
        acc + contributions.map((row) => grass(row[i])).join("") + "\n",
      "",
    ) + legend;
};

const contributionsToText = (
  contributions: ContributionDay[][],
  totalContributions: number,
  maxContributionDay: ContributionDay,
  {
    noTotal = false,
  } = {},
) => {
  const total = !noTotal ? totalMsg(totalContributions) : "";

  const pad = String(maxContributionDay.contributionCount).length;

  return total +
    contributions[0].reduce(
      (acc, _, i) =>
        acc + contributions.map((row) =>
          `${row[i]?.contributionCount ?? ""}`.padStart(pad)
        ).join(",") +
        "\n",
      "",
    );
};

const contributionsToSvg = (
  contributions: ContributionDay[][],
  totalContributions: number,
  {
    noTotal = false,
    noLegend = false,
    scheme = "github",
    fontColor = "000",
    frame = "none",
    bg = "none",
  } = {},
): string => {
  const svgID = "deno-github-contributions-graph";
  const rectSize = 10;
  const rectSpan = 3;
  const rectRadius = 2;
  const rectStep = rectSize + rectSpan;

  const weekCounts = 53;
  const dayCounts = 7;

  const topPadding = noTotal ? 0 : 1;
  const bottomPadding = noLegend ? 0 : 1;

  const width = rectStep * (weekCounts + 2) - rectSpan;
  const height = rectStep * (dayCounts + 2 + topPadding + bottomPadding) -
    rectSpan;

  const offset = { x: rectStep, y: rectStep * (topPadding + 1) };

  // the left top position of the 5 pixels of legend
  const legendPos = {
    x: width - rectStep * 10 + rectSpan,
    y: offset.y + rectStep * dayCounts + rectSpan,
  };

  const styles = `#${svgID} .pixel {
    width: ${rectSize}px;
    height: ${rectSize}px;
    rx: ${rectRadius}px;
    ry: ${rectRadius}px;
    stroke: rgba(27,31,35,0.06);
    stroke-width: 2px;
  }
  #${svgID} text {
    font-family: monospace;
    font-size: ${rectSize * 1.5}px;
    fill: #${convertToSixChars(fontColor, "000")};
  }
  `;

  try {
    const colorScheme = getColorScheme(scheme);

    const rect = (x: number, y: number, {
      contributionLevel = "",
      date = "",
      contributionCount = 0,
    }): string =>
      contributionLevel == null ? "" : h("rect", {
        class: `pixel ${contributionLevel}`,
        x: x * rectStep,
        y: y * rectStep,
        "data-date": date,
        "data-count": contributionCount,
      }, h("title", `${date}: ${contributionCount}`));

    frame = confirmHex(frame, "none");
    const stroke = frame === "none" ? frame : "#" + convertToSixChars(frame);
    bg = confirmHex(bg, "none");
    const fill = bg === "none" ? bg : "#" + convertToSixChars(bg);

    return h(
      "svg",
      { width, height, xmlns: "http://www.w3.org/2000/svg", id: svgID },
      h(
        "style",
        styles,
        ...Object.entries(CONTRIBUTION_LEVELS).map(([k, v]) =>
          `#${svgID} .${k} { fill: ${colorScheme.hexStrColors[v]}; }`
        ),
      ),
      h("rect", { width, height, stroke, "stroke-width": "2px", fill }),
      noTotal ? "" : h(
        "g",
        h(
          "text",
          { transform: `translate(${offset.x}, ${offset.y - rectSpan * 2})` },
          totalMsg(totalContributions),
        ),
      ),
      h(
        "g",
        { transform: `translate(${offset.x}, ${offset.y})` },
        contributions.map((column, i) =>
          column.map((pixel, j) => rect(i, j, pixel)).join("")
        ).join(""),
      ),
      noLegend ? "" : h(
        "g",
        { transform: `translate(${legendPos.x}, ${legendPos.y})` },
        h(
          "text",
          {
            transform: `translate(-${rectStep * 1}, ${rectSize * 1})`,
            "text-anchor": "end",
          },
          "Less",
        ),
        Object.keys(CONTRIBUTION_LEVELS).map((levelName, idx) =>
          rect(idx, 0, { contributionLevel: levelName })
        ).join(""),
        h(
          "text",
          {
            transform: `translate(${rectStep * 5 + rectSize}, ${rectSize * 1})`,
          },
          "More",
        ),
      ),
    );
  } catch (error) {
    return h(
      "svg",
      { width, height, xmlns: "http://www.w3.org/2000/svg", id: svgID },
      h(
        "text",
        { y: height },
        `${error}`,
      ),
    );
  }
};

const getContributions = async (
  userName: string,
  token: string,
  contributionOptions: ContributionOptions = {},
) => {
  const { from, to } = contributionOptions;
  const { contributions, totalContributions } = await getContributionCalendar(
    userName,
    token,
    { from, to },
  );

  const maxContributionDay = getMaxContributionDay(contributions);

  const toJson = ({ flat = false } = {}) =>
    contributionsToJson(contributions, totalContributions, { flat });

  const toTerm = (
    {
      noTotal = false,
      noLegend = false,
      scheme = "github",
      pixel = "■",
      invert = false,
    } = {},
  ) =>
    contributionsToTerm(contributions, totalContributions, {
      noTotal,
      noLegend,
      scheme,
      pixel,
      invert,
    });

  const toText = (
    {
      noTotal = false,
    } = {},
  ) =>
    contributionsToText(contributions, totalContributions, maxContributionDay, {
      noTotal,
    });
  const toSvg = (
    {
      noTotal = false,
      noLegend = false,
      scheme = "github",
      fontColor = "000",
      frame = "none",
      bg = "none",
    } = {},
  ) =>
    contributionsToSvg(contributions, totalContributions, {
      noTotal,
      noLegend,
      scheme,
      fontColor,
      frame,
      bg,
    });

  return {
    contributions,
    totalContributions,
    maxContributionDay,
    toJson,
    toTerm,
    toText,
    toSvg,
  };
};

export {
  CONTRIBUTION_LEVELS,
  contributionsToJson,
  contributionsToSvg,
  contributionsToTerm,
  contributionsToText,
  getContributionCalendar,
  getContributions,
  getMaxContributionDay,
  isValidContributionLevelName,
  moreContributionDay,
  totalMsg,
};

export type {
  ContributionDay,
  ContributionLevelName,
  ContributionOptions,
  ContributionResponse,
};
