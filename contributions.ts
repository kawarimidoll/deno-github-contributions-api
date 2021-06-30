import { ky, rgb24 } from "./deps.ts";
import { ContributionDay } from "./types.ts";
import { getColorScheme } from "./color_scheme.ts";

const contributions = async (userName: string, token: string) => {
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

  console.log(totalContributions + " contributions in the last year");

  const colorScheme = getColorScheme();
  const grass = (day?: ContributionDay) =>
    day?.color ? rgb24("■", colorScheme(day?.contributionLevel)) : "";

  return weeks[0].contributionDays.map((_, i) =>
    weeks.map((row) => grass(row.contributionDays[i])).join("")
  ).join("\n");
};

export { contributions };
