import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const {
  SECRET_TOKEN,
} = config({ safe: true });

export { SECRET_TOKEN };
