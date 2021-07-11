import { ky, rgb24 } from "./deps.ts";
import { getColorScheme } from "./color_scheme.ts";
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

const getContributions = async (
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

  const moreContributedDay = (a: ContributionDay, b: ContributionDay) =>
    a.contributionCount > b.contributionCount ? a : b;

  const maxContributionDay = contributions.reduce(
    (max, week) =>
      moreContributedDay(
        max,
        week.reduce(
          (maxInWeek, current) => moreContributedDay(maxInWeek, current),
          week[0],
        ),
      ),
    contributions[0][0],
  );

  const totalMsg = totalContributions + " contributions in the last year\n";

  const toJson = (
    {
      flat = false,
    } = {},
  ) =>
    JSON.stringify({
      contributions: flat ? contributions.flat() : contributions,
      totalContributions,
    });

  const toTerm = (
    {
      noTotal = false,
      noLegend = false,
      scheme = "github",
      pixel = "■",
    } = {},
  ) => {
    if (pixel.length > 2) {
      // length == 2 is ok
      // like as '[]', ' '
      throw new Error(`Pixel '${pixel}' is too long. Use 1 or 2 characters.`);
    }

    const colorScheme = getColorScheme(scheme);

    const total = !noTotal ? totalMsg : "";

    // 10 is length of 'Less  More'
    // 5 is count of colored pixels as legend
    const legendOffset = " ".repeat(
      (contributions.length - 5) * pixel.length - 10,
    );

    const legend = !noLegend
      ? legendOffset +
        "Less " + colorScheme.hexNumColors.map((color) =>
          rgb24(pixel, color)
        ).join("") + " More\n"
      : "";

    const grass = (day?: ContributionDay) =>
      day?.contributionLevel
        ? rgb24(pixel, colorScheme.getByLevel(day?.contributionLevel))
        : "";

    return total +
      contributions[0].reduce(
        (acc, _, i) =>
          acc + contributions.map((row) => grass(row[i])).join("") + "\n",
        "",
      ) + legend;
  };

  const toText = (
    {
      noTotal = false,
    } = {},
  ) => {
    const total = !noTotal ? totalMsg : "";

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

  return {
    contributions,
    totalContributions,
    maxContributionDay,
    toJson,
    toTerm,
    toText,
  };
};

export { CONTRIBUTION_LEVELS, getContributions, isValidContributionLevelName };
export type { ContributionDay, ContributionLevelName };
