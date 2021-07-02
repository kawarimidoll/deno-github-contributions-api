import { contributions } from "./contributions.ts";
import env from "./env.ts";

console.log(
  await contributions("kawarimidoll", env("GITHUB_READ_USER_TOKEN"), {
    scheme: "gameboy",
  }),
);
