import { ky } from "./deps.ts";

const prefixUrl = "https://github-contributions-api.deno.dev";
const k = ky.create({ prefixUrl });
try {
  console.log("Root");
  await k("").text();

  console.log("User");
  await k("kawarimidoll").text();

  console.log("Text");
  await k("kawarimidoll.text").text();

  console.log("Json");
  await k("kawarimidoll.json").text();

  console.log("Term");
  await k("kawarimidoll.term").text();

  console.log("Svg");
  await k("kawarimidoll.svg").text();

  console.log("Parameters");
  await k("kawarimidoll.svg", {
    searchParams: {
      scheme: "random",
      "no-total": true,
      bg: "123abc",
    },
  }).text();

  console.log("System all green!");
} catch (error) {
  console.error(`${error}`);
  Deno.exit(1);
}
