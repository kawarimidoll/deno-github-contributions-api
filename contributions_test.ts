import { assert, assertEquals, assertRejects, assertThrows } from "@std/assert";
import {
  type ContributionDay,
  contributionsToJson,
  contributionsToSvg,
  contributionsToTerm,
  contributionsToText,
  getContributionCalendar,
  getContributions,
  getMaxContributionDay,
  isValidContributionLevelName,
  moreContributionDay,
  totalMsg,
} from "./contributions.ts";

const {
  contributions,
  totalContributions,
}: {
  contributions: ContributionDay[][];
  totalContributions: number;
} = JSON.parse(
  await Deno.readTextFile("./resources/tests/example_contributions.json"),
);

const totalMessage = totalMsg(totalContributions);
const weeks = contributions.map((week) => ({ contributionDays: week }));

const max: ContributionDay = {
  contributionCount: 32,
  contributionLevel: "FOURTH_QUARTILE",
  date: "2021-03-22",
  color: "#216e39",
};

Deno.test("contributionsToJson", () => {
  assertEquals(
    contributionsToJson(contributions, totalContributions),
    JSON.stringify({ contributions, totalContributions }),
  );

  assertEquals(
    contributionsToJson(contributions, totalContributions, { flat: true }),
    JSON.stringify({ contributions: contributions.flat(), totalContributions }),
  );
});

Deno.test("contributionsToSvg", async () => {
  const resultToSvg = await Deno.readTextFile(
    "./resources/tests/to_svg.svg",
  );
  const resultToSvgWithParams = await Deno.readTextFile(
    "./resources/tests/to_svg_bg_font_frame_scheme.svg",
  );
  assertEquals(
    contributionsToSvg(contributions, totalMessage),
    resultToSvg,
  );
  assertEquals(
    contributionsToSvg(contributions, totalMessage, {
      bg: "786688",
      fontColor: "#d7f07b",
      frame: "#f03153",
      scheme: "amber",
    }),
    resultToSvgWithParams,
  );
});

Deno.test("contributionsToTerm", async () => {
  const resultToTerm = await Deno.readTextFile(
    "./resources/tests/to_term_github.text",
  );
  const resultToTermUnicorn = await Deno.readTextFile(
    "./resources/tests/to_term_unicorn.text",
  );
  const resultToTermNoTotal = await Deno.readTextFile(
    "./resources/tests/to_term_no_total.text",
  );
  const resultToTermNoLegend = await Deno.readTextFile(
    "./resources/tests/to_term_no_legend.text",
  );
  const resultToTermPixelX = await Deno.readTextFile(
    "./resources/tests/to_term_pixel_x.text",
  );
  const resultToTermInvert = await Deno.readTextFile(
    "./resources/tests/to_term_invert.text",
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage),
    resultToTerm,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, {
      noTotal: false,
      noLegend: false,
      scheme: "github",
      pixel: "■",
      invert: false,
    }),
    resultToTerm,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, {
      scheme: "unicorn",
    }),
    resultToTermUnicorn,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, { noTotal: true }),
    resultToTermNoTotal,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, { noLegend: true }),
    resultToTermNoLegend,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, { pixel: "x" }),
    resultToTermPixelX,
  );
  assertThrows(
    () => {
      contributionsToTerm(contributions, totalMessage, { pixel: "xxx" });
    },
    Error,
  );
  assertEquals(
    contributionsToTerm(contributions, totalMessage, { invert: true }),
    resultToTermInvert,
  );
});

Deno.test("contributionsToText", async () => {
  const resultToText = await Deno.readTextFile(
    "./resources/tests/to_text.text",
  );
  const resultToTextNoTotal = await Deno.readTextFile(
    "./resources/tests/to_text_no_total.text",
  );
  assertEquals(
    contributionsToText(contributions, totalMessage, max),
    resultToText,
  );
  assertEquals(
    contributionsToText(contributions, totalMessage, max, {
      noTotal: true,
    }),
    resultToTextNoTotal,
  );
});

Deno.test("getContributions", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = () => Promise.resolve(Response.json({ data: null }));

  await assertRejects(
    () => getContributions("a", "a"),
    Error,
    "Could not get contributions data",
  );

  globalThis.fetch = () =>
    Promise.resolve(
      Response.json({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: { weeks, totalContributions },
            },
          },
        },
      }),
    );

  const obj = await getContributions("a", "a");
  assert(obj);
  assertEquals(obj.contributions, contributions);
  assertEquals(obj.totalContributions, totalContributions);
  assertEquals(obj.maxContributionDay, max);
  assert(obj.toJson());
  assert(obj.toTerm());
  assert(obj.toText());

  globalThis.fetch = originalFetch;
});

Deno.test("getContributionCalendar", async () => {
  const originalFetch = globalThis.fetch;

  await assertRejects(
    () => getContributionCalendar("userName", ""),
    Error,
    "Missing required arguments",
  );
  await assertRejects(
    () => getContributionCalendar("", "token"),
    Error,
    "Missing required arguments",
  );

  globalThis.fetch = () => Promise.resolve(Response.json({ data: null }));

  await assertRejects(
    () => getContributionCalendar("a", "a"),
    Error,
    "Could not get contributions data",
  );

  globalThis.fetch = () =>
    Promise.resolve(
      Response.json({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: { weeks, totalContributions },
            },
          },
        },
      }),
    );

  assertEquals(
    await getContributionCalendar("a", "a"),
    { contributions, totalContributions },
  );

  globalThis.fetch = originalFetch;
});

Deno.test("getMaxContributionDay", () => {
  assertEquals(getMaxContributionDay(contributions), max);
});

Deno.test("isValidContributionLevelName", () => {
  assert(isValidContributionLevelName("NONE"));
  assert(isValidContributionLevelName("FIRST_QUARTILE"));
  assert(isValidContributionLevelName("SECOND_QUARTILE"));
  assert(isValidContributionLevelName("THIRD_QUARTILE"));
  assert(isValidContributionLevelName("FOURTH_QUARTILE"));
  assert(!isValidContributionLevelName(""));
  assert(!isValidContributionLevelName("none"));
});

Deno.test("moreContributionDay", () => {
  const a: ContributionDay = {
    contributionCount: 10,
    contributionLevel: "FIRST_QUARTILE",
    date: "2000-01-01",
    color: "#eeeeee",
  };
  const b: ContributionDay = {
    contributionCount: 3,
    contributionLevel: "FIRST_QUARTILE",
    date: "2000-01-01",
    color: "#eeeeee",
  };

  assertEquals(moreContributionDay(a, b), a);
});

Deno.test("totalMsg", () => {
  assertEquals(totalMsg(10), "10 contributions in the last year");
  assertEquals(
    totalMsg(10, { from: "2025-01-01", to: "2025-03-01" }),
    "10 contributions from 2025-01-01 to 2025-03-01",
  );
  assertEquals(
    totalMsg(10, { from: "2025-01-01" }),
    "10 contributions from 2025-01-01",
  );
  assertEquals(
    totalMsg(10, { to: "2025-03-01" }),
    "10 contributions to 2025-03-01",
  );
});
