import ky from "https://cdn.skypack.dev/ky?dts";

// @deno-types="https://esm.sh/testdouble@3.16.1/index.d.ts"
import * as testdouble from "https://esm.sh/testdouble@3.16.1/dist/testdouble.js";

import stringWidth from "https://cdn.skypack.dev/string-width";
import { bgRgb24, rgb24 } from "https://deno.land/std@0.101.0/fmt/colors.ts";
import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

import { Env } from "https://deno.land/x/env@v2.2.0/env.js";
const env = new Env();

export {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  bgRgb24,
  env,
  ky,
  rgb24,
  stringWidth,
  testdouble,
};
