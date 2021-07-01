const confirmHex = (str: string) =>
  str.match(/^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/) ? str : "000";

const convertToSixChars = (str: string) =>
  confirmHex(str).replace(
    /^#?(.*)$/,
    (_, hex) => (hex.length == 3) ? hex.replace(/./g, "$&$&") : hex,
  );

const hexToRgbObj = (color = "000") =>
  Object.fromEntries(
    (convertToSixChars(color).match(/../g) ?? []).map((
      c,
      i,
    ) => ["rgb".charAt(i), parseInt("0x" + c)]),
  );

const hexToRgbNum = (color = "000") =>
  parseInt("0x" + convertToSixChars(color));

export { confirmHex, convertToSixChars, hexToRgbNum, hexToRgbObj };
