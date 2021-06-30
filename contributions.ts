import { ky, rgb24 } from "./deps.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";
import { ContributionDay } from "./types.ts";
import { getColorScheme } from "./color_scheme.ts";

const userName = "kawarimidoll";

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

const colorScheme = getColorScheme();
const grass = (day?: ContributionDay) =>
  day?.color ? rgb24("■", colorScheme(day?.contributionLevel)) : "";

weeks[0].contributionDays.forEach((_, i) => {
  console.log(
    weeks.map((row) => grass(row.contributionDays[i])).join(""),
  );
});
