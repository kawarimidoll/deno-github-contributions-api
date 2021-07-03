const defaultColor = "eee";

const confirmHex = (str: string) =>
  /^#?([0-9a-f]{3}){1,2}$/i.test(str) ? str : defaultColor;

const convertToSixChars = (str: string) =>
  confirmHex(str).replace(
    /^#?(.*)$/,
    (_, hex) => (hex.length == 3) ? hex.replace(/./g, "$&$&") : hex,
  );

const hexStrToRgbObj = (color = defaultColor) =>
  Object.fromEntries(
    (convertToSixChars(color).match(/../g) ?? []).map((
      c,
      i,
    ) => ["rgb".charAt(i), parseInt("0x" + c)]),
  );

const hexStrToHexNum = (color = defaultColor) =>
  parseInt("0x" + convertToSixChars(color));

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
