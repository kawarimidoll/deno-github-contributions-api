import { contributions } from "./contributions.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";

console.log(await contributions("kawarimidoll", GITHUB_READ_USER_TOKEN));
