import { getContributions } from "./contributions.ts";
import env from "./env.ts";

const contributions = await getContributions(
  "kawarimidoll",
  env("GITHUB_READ_USER_TOKEN"),
);
// console.log(contributions.toJson());
console.log(contributions.toTerm({ scheme: "unicorn" }));
console.log(contributions.toText());
