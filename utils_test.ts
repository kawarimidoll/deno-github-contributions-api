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
});

Deno.test("hexToRgbObj", () => {
  assertEquals(hexToRgbObj("#123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexToRgbObj("123456"), { r: 18, g: 52, b: 86 });
  assertEquals(hexToRgbObj("#12A"), { r: 17, g: 34, b: 170 });
  assertEquals(hexToRgbObj("12A"), { r: 17, g: 34, b: 170 });
});

Deno.test("hexToRgbNum", () => {
  assertEquals(hexToRgbNum("#123456"), 0x123456);
  assertEquals(hexToRgbNum("123456"), 0x123456);
  assertEquals(hexToRgbNum("#12A"), 0x1122aa);
  assertEquals(hexToRgbNum("12A"), 0x1122aa);
});
