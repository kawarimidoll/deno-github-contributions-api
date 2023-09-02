import ky from "https://cdn.skypack.dev/ky@0.28.5?dts";

import testdouble from "https://esm.sh/testdouble@3.18.0/dist/testdouble.js";

import stringWidth from "https://cdn.skypack.dev/string-width@5.0.0?dts";

import { bgRgb24, rgb24 } from "https://deno.land/std@0.201.0/fmt/colors.ts";

import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.201.0/testing/asserts.ts";

import { loadSync } from "https://deno.land/std@0.201.0/dotenv/mod.ts";
loadSync({
  export: true,
  examplePath: null,
  defaultsPath: null,
  restrictEnvAccessTo: ["GH_READ_USER_TOKEN"],
});

import { outdent } from "https://deno.land/x/outdent@v0.8.0/mod.ts";

import { tag as h } from "https://deno.land/x/markup_tag@0.4.0/mod.ts";

export {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
  bgRgb24,
  h,
  ky,
  outdent,
  rgb24,
  stringWidth,
  testdouble,
};
