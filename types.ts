interface ContributionDay {
  contributionCount: number;
  contributionLevel: ContributionLevelName;
  date: string;
  color: string;
}

type ContributionLevelName =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type ColorSchemeName =
  | "github"
  | "halloween"
  | "amber"
  | "blue"
  | "bluegrey"
  | "brown"
  | "cyan"
  | "deeporange"
  | "deeppurple"
  | "green"
  | "grey"
  | "indigo"
  | "lightblue"
  | "lightgreen"
  | "lime"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellowMd"
  | "summer"
  | "unicorn"
  | "sunset"
  | "moon"
  | "psychedelic"
  | "yellow";

export type { ColorSchemeName, ContributionDay, ContributionLevelName };
