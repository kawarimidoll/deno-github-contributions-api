import { getContributions } from "./contributions.ts";
import { env } from "./deps.ts";

const username = "kawarimidoll";
const token = env.require("GH_READ_USER_TOKEN");

const contributions = await getContributions(username, token);

// console.log(contributions.toJson());
console.log(contributions.toTerm({ scheme: "random" }));
// console.log(contributions.toText());
// console.log(contributions.toTerm({ invert: true, pixel: " " }));
