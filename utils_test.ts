import { assertEquals } from "./deps.ts";
import { hexToRgbNum, hexToRgbObj } from "./utils.ts";

Deno.test("hexToRgbObj", () => {
  assertEquals(hexToRgbObj("#123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexToRgbObj("123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexToRgbObj("#123"), { r: 17, g: 34, b: 51 });
  assertEquals(hexToRgbObj("123"), { r: 17, g: 34, b: 51 });
});

Deno.test("hexToRgbNum", () => {
  assertEquals(hexToRgbNum("#123456"), 0x123456);
  assertEquals(hexToRgbNum("123456"), 0x123456);
  assertEquals(hexToRgbNum("#123"), 0x112233);
  assertEquals(hexToRgbNum("123"), 0x112233);
});
