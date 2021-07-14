import { assert, assertEquals, assertThrows } from "./deps.ts";
import {
  COLOR_SCHEMES,
  getColorScheme,
  isValidColorSchemeName,
} from "./color_scheme.ts";

Deno.test("getColorScheme", () => {
  const correctScheme = ["#eeeeee", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  const scheme1 = getColorScheme("github");
  assertEquals(scheme1.hexStrColors, correctScheme);

  const scheme2 = getColorScheme();
  assertEquals(scheme2.hexStrColors, correctScheme);

  assertEquals(scheme2.getByLevel("NONE"), 0xeeeeee);
  assertEquals(scheme2.getByLevel("FIRST_QUARTILE"), 0x9be9a8);
  assertEquals(scheme2.getByLevel(), 0xeeeeee);

  const scheme3 = getColorScheme("random");
  assert(Object.values(COLOR_SCHEMES).includes(scheme3.hexStrColors));

  assertThrows(() => {
    getColorScheme("123456");
  });
});

Deno.test("isValidColorSchemeName", () => {
  assert(isValidColorSchemeName("github"));
  assert(isValidColorSchemeName("unicorn"));
  assert(!isValidColorSchemeName(""));
  assert(!isValidColorSchemeName("nothub"));
});
