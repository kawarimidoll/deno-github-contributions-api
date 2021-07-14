import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "./deps.ts";
import {
  ContributionDay,
  contributionsToJson,
  contributionsToTerm,
  contributionsToText,
  getContributionCalendar,
  getMaxContributionDay,
  isValidContributionLevelName,
  moreContributionDay,
  totalMsg,
} from "./contributions.ts";

const {
  contributions,
  totalContributions,
} = JSON.parse(
  await Deno.readTextFile("./resources/tests/example_contributions.json"),
);

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
    contributionsToTerm(contributions, totalContributions),
    resultToTerm,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, {
      noTotal: false,
      noLegend: false,
      scheme: "github",
      pixel: "■",
      invert: false,
    }),
    resultToTerm,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, {
      scheme: "unicorn",
    }),
    resultToTermUnicorn,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, { noTotal: true }),
    resultToTermNoTotal,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, { noLegend: true }),
    resultToTermNoLegend,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, { pixel: "x" }),
    resultToTermPixelX,
  );
  assertThrows(
    () => {
      contributionsToTerm(contributions, totalContributions, { pixel: "xxx" });
    },
    Error,
  );
  assertEquals(
    contributionsToTerm(contributions, totalContributions, { invert: true }),
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
    contributionsToText(contributions, totalContributions, max),
    resultToText,
  );
  assertEquals(
    contributionsToText(contributions, totalContributions, max, {
      noTotal: true,
    }),
    resultToTextNoTotal,
  );
});

Deno.test("getContributionCalendar", () => {
  assertThrowsAsync(
    () => {
      return getContributionCalendar("", "");
    },
    Error,
    "Missing required arguments",
  );
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
  assertEquals(totalMsg(10), "10 contributions in the last year\n");
});