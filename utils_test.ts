import { assertEquals } from "./deps.ts";
import {
  confirmHex,
  convertToSixChars,
  hexToRgbNum,
  hexToRgbObj,
} from "./utils.ts";

Deno.test("confirmHex", () => {
  assertEquals(confirmHex("#123456"), "#123456");
  assertEquals(confirmHex("123456"), "123456");
  assertEquals(confirmHex("#123"), "#123");
  assertEquals(confirmHex("123"), "123");
  assertEquals(confirmHex("#12345"), "000");
  assertEquals(confirmHex("12345"), "000");
  assertEquals(confirmHex("#12"), "000");
  assertEquals(confirmHex("12"), "000");
  assertEquals(confirmHex("hex"), "000");
});

Deno.test("convertToSixChars", () => {
  assertEquals(convertToSixChars("#123456"), "123456");
  assertEquals(convertToSixChars("123456"), "123456");
  assertEquals(convertToSixChars("#123"), "112233");
  assertEquals(convertToSixChars("123"), "112233");
  assertEquals(convertToSixChars("12"), "000000");
});

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
