const defaultPixelColor = "eee";

const confirmHex = (str: string, defaultColor = defaultPixelColor) =>
  /^#?([0-9a-f]{3}){1,2}$/i.test(str) ? str : defaultColor;

const convertToSixChars = (str: string, defaultColor = defaultPixelColor) =>
  confirmHex(str, defaultColor).replace(
    /^#?(.*)$/,
    (_, hex) => (hex.length == 3) ? hex.replace(/./g, "$&$&") : hex,
  );

const hexStrToRgbObj = (color: string, defaultColor = defaultPixelColor) =>
  Object.fromEntries(
    (convertToSixChars(color || defaultColor).match(/../g) ?? []).map((
      c,
      i,
    ) => ["rgb".charAt(i), parseInt("0x" + c)]),
  );

const hexStrToHexNum = (color: string, defaultColor = defaultPixelColor) =>
  parseInt("0x" + convertToSixChars(color || defaultColor));

// deno-lint-ignore no-explicit-any
const hasOwnProperty = (obj: { [key: string]: any }, key: string): boolean => {
  return !!(obj) && Object.prototype.hasOwnProperty.call(obj, key);
};

export {
  confirmHex,
  convertToSixChars,
  hasOwnProperty,
  hexStrToHexNum,
  hexStrToRgbObj,
};
