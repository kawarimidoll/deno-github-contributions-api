import { assert, assertEquals } from "./deps.ts";
import {
  confirmHex,
  convertToSixChars,
  hasOwnProperty,
  hexStrToHexNum,
  hexStrToRgbObj,
} from "./utils.ts";

Deno.test("confirmHex", () => {
  assertEquals(confirmHex("#123456"), "#123456");
  assertEquals(confirmHex("123456"), "123456");
  assertEquals(confirmHex("#12A"), "#12A");
  assertEquals(confirmHex("12A"), "12A");
  assertEquals(confirmHex("#12345"), "eee");
  assertEquals(confirmHex("12345"), "eee");
  assertEquals(confirmHex("#12"), "eee");
  assertEquals(confirmHex("12"), "eee");
  assertEquals(confirmHex("hex"), "eee");
});

Deno.test("convertToSixChars", () => {
  assertEquals(convertToSixChars("#123456"), "123456");
  assertEquals(convertToSixChars("123456"), "123456");
  assertEquals(convertToSixChars("#12A"), "1122AA");
  assertEquals(convertToSixChars("12A"), "1122AA");
  assertEquals(convertToSixChars("12"), "eeeeee");
  assertEquals(convertToSixChars("hex"), "eeeeee");
});

Deno.test("hexStrToRgbObj", () => {
  assertEquals(hexStrToRgbObj("#123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexStrToRgbObj("123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexStrToRgbObj("#12A"), { r: 17, g: 34, b: 170 });
  assertEquals(hexStrToRgbObj("12A"), { r: 17, g: 34, b: 170 });
  assertEquals(hexStrToRgbObj("12"), { r: 238, g: 238, b: 238 });
  assertEquals(hexStrToRgbObj("hex"), { r: 238, g: 238, b: 238 });
});

Deno.test("hexStrToHexNum", () => {
  assertEquals(hexStrToHexNum("#123456"), 0x123456);
  assertEquals(hexStrToHexNum("123456"), 0x123456);
  assertEquals(hexStrToHexNum("#12A"), 0x1122aa);
  assertEquals(hexStrToHexNum("12A"), 0x1122aa);
});

Deno.test("hasOwnProperty", () => {
  const obj = { a: 1, b: 2, c: 3 };
  assert(hasOwnProperty(obj, "a"));
  assert(!hasOwnProperty(obj, "d"));
});
