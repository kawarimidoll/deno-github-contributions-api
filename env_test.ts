import { assert, assertThrows } from "./deps.ts";
import env from "./env.ts";

Deno.test("env", () => {
  assert(env("GH_READ_USER_TOKEN"));

  assertThrows(() => {
    env("NOT_EXIST_TOKEN");
  });
});
