import { getContributions } from "./contributions.ts";
import env from "./env.ts";

const username = "kawarimidoll";
const token = env("GITHUB_READ_USER_TOKEN");

const contributions = await getContributions(username, token);

// console.log(contributions.toJson());
console.log(contributions.toTerm({ scheme: "random" }));
// console.log(contributions.toText());
