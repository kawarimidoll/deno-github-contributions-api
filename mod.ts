/**
 * Fetch and render GitHub contributions data as JSON, SVG, terminal text, or plain text.
 *
 * ```ts
 * import { getContributions } from "@kawarimidoll/github-contributions-api";
 *
 * const contributions = await getContributions("username", "ghp_token");
 * console.log(contributions.toTerm({ scheme: "github" }));
 * ```
 *
 * @module
 */

export {
  CONTRIBUTION_LEVELS,
  getContributions,
  isValidContributionLevelName,
} from "./contributions.ts";

export { COLOR_SCHEMES, getColorScheme } from "./color_scheme.ts";

export type {
  ContributionDay,
  ContributionLevelName,
  Contributions,
} from "./contributions.ts";

export type { ColorSchemeName } from "./color_scheme.ts";
