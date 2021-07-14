import { assert, assertEquals, assertThrowsAsync } from "./deps.ts";
import {
  ContributionDay,
  // contributionsToJson,
  // contributionsToTerm,
  // contributionsToText,
  getContributionCalendar,
  getMaxContributionDay,
  isValidContributionLevelName,
  moreContributionDay,
  totalMsg,
} from "./contributions.ts";

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
  const max: ContributionDay = {
    contributionCount: 30,
    contributionLevel: "FOURTH_QUARTILE",
    date: "2000-01-01",
    color: "#eeeeee",
  };
  const weeks: ContributionDay[][] = [
    [
      {
        contributionCount: 10,
        contributionLevel: "FIRST_QUARTILE",
        date: "2000-01-01",
        color: "#eeeeee",
      },
      {
        contributionCount: 10,
        contributionLevel: "FIRST_QUARTILE",
        date: "2000-01-01",
        color: "#eeeeee",
      },
    ],
    [
      {
        contributionCount: 10,
        contributionLevel: "FIRST_QUARTILE",
        date: "2000-01-01",
        color: "#eeeeee",
      },
      max,
    ],
  ];

  assertEquals(getMaxContributionDay(weeks), max);
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
