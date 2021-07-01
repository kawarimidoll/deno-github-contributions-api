import { ky, rgb24 } from "./deps.ts";
import { ColorSchemeName, ContributionDay } from "./types.ts";
import { getColorScheme } from "./color_scheme.ts";

const contributions = async (
  userName: string,
  token: string,
  options: {
    total?: boolean;
    legend?: boolean;
    scheme?: ColorSchemeName | "random";
  },
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

  const colorScheme = getColorScheme(options.scheme);

  const total = (options.total ?? true)
    ? totalContributions + " contributions in the last year\n"
    : "";
  const legend = (options.legend ?? true)
    ? "\n Less " + colorScheme.colors.map((color) =>
      rgb24("■", color)
    ).join("") + " More"
    : "";

  const grass = (day?: ContributionDay) =>
    day?.contributionLevel
      ? rgb24("■", colorScheme.getByLevel(day?.contributionLevel))
      : "";

  return total +
    weeks[0].contributionDays.map((_, i) =>
      weeks.map((row) => grass(row.contributionDays[i])).join("")
    ).join("\n") + legend;
};

export { contributions };
