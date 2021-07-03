import { ky, rgb24 } from "./deps.ts";
import { ContributionDay } from "./types.ts";
import { getColorScheme } from "./color_scheme.ts";

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

  const { weeks, totalContributions }: {
    weeks: { contributionDays: ContributionDay[] }[];
    totalContributions: number;
  } = data?.user?.contributionsCollection
    ?.contributionCalendar;

  if (!weeks || !totalContributions) {
    throw new Error("Could not get contributions data");
  }

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

  const toJson = () =>
    JSON.stringify({
      contributions,
      totalContributions,
    });

  const toTerm = (
    {
      noTotal = false,
      noLegend = false,
      scheme = "github",
    } = {},
  ) => {
    const colorScheme = getColorScheme(scheme);

    const total = !noTotal ? totalMsg : "";

    const legend = !noLegend
      ? " Less " + colorScheme.colors.map((color) =>
        rgb24("■", color)
      ).join("") + " More\n"
      : "";

    const grass = (day?: ContributionDay) =>
      day?.contributionLevel
        ? rgb24("■", colorScheme.getByLevel(day?.contributionLevel))
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

  return { toJson, toTerm, toText };
};

export { getContributions };
