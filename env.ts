import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  GITHUB_READ_USER_TOKEN,
} = config({ safe: true });

export { GITHUB_READ_USER_TOKEN };
