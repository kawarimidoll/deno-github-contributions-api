import ky from "https://cdn.skypack.dev/ky@0.28.5?dts";

import testdouble from "https://esm.sh/testdouble@3.16.6/dist/testdouble.js";

import stringWidth from "https://cdn.skypack.dev/string-width@5.0.0?dts";

import { bgRgb24, rgb24 } from "https://deno.land/std@0.154.0/fmt/colors.ts";

import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.154.0/testing/asserts.ts";

import { Env } from "https://deno.land/x/env@v2.2.1/env.js";
const env = new Env();

import { tag as h } from "https://deno.land/x/markup_tag@0.3.0/mod.ts";

export {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
  bgRgb24,
  env,
  h,
  ky,
  rgb24,
  stringWidth,
  testdouble,
};
