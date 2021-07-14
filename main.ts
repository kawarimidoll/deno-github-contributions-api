import { getContributions } from "./contributions.ts";
import env from "./env.ts";

const username = "kawarimidoll";
const token = env("GH_READ_USER_TOKEN");

const contributions = await getContributions(username, token);

// console.log(contributions.toJson());
console.log(contributions.toTerm({ scheme: "random" }));
// console.log(contributions.toText());
console.log(contributions.toTerm({ scheme: "random", invert: true, pixel: "　" }));