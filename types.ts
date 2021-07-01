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

import { ColorSchemeName } from "./color_scheme.ts";

export type { ColorSchemeName, ContributionDay, ContributionLevelName };
