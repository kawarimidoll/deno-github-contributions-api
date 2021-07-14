import { getColorScheme } from "./color_scheme.ts";
import { bgRgb24, ky, rgb24, stringWidth } from "./deps.ts";
import { hasOwnProperty } from "./utils.ts";

interface ContributionDay {
  contributionCount: number;
  contributionLevel: ContributionLevelName;
  date: string;
  color: string;
}

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
  !!name && hasOwnProperty(CONTRIBUTION_LEVELS, name);

const getContributionCalendar = async (
  userName: string,
  token: string,
) => {
  if (!userName || !token) {
    throw new Error("Missing required arguments");
  }

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

  const json = { query, variables };
  const url = "https://api.github.com/graphql";
  const { data } = await ky.post(url, {
    headers: { Authorization: `Bearer ${token}` },
    json,
  }).json();

  const contributionCalendar = data?.user?.contributionsCollection
    ?.contributionCalendar;

  if (
    !contributionCalendar || !hasOwnProperty(contributionCalendar, "weeks") ||
    !hasOwnProperty(contributionCalendar, "totalContributions")
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

const getContributions = async (
  userName: string,
  token: string,
) => {
  const { contributions, totalContributions } = await getContributionCalendar(
    userName,
    token,
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

  return {
    contributions,
    totalContributions,
    maxContributionDay,
    toJson,
    toTerm,
    toText,
  };
};

export {
  CONTRIBUTION_LEVELS,
  contributionsToJson,
  contributionsToTerm,
  contributionsToText,
  getContributionCalendar,
  getContributions,
  getMaxContributionDay,
  isValidContributionLevelName,
  moreContributionDay,
  totalMsg,
};
export type { ContributionDay, ContributionLevelName };
