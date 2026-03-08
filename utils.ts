const defaultPixelColor = "eee";

function confirmHex(str: string, defaultColor = defaultPixelColor): string {
  return /^#?([0-9a-f]{3}){1,2}$/i.test(str) ? str : defaultColor;
}

function convertToSixChars(
  str: string,
  defaultColor = defaultPixelColor,
): string {
  return confirmHex(str, defaultColor).replace(
    /^#?(.*)$/,
    (_, hex) => (hex.length === 3) ? hex.replace(/./g, "$&$&") : hex,
  );
}

function hexStrToRgbObj(
  color: string,
  defaultColor = defaultPixelColor,
): Record<string, number> {
  return Object.fromEntries(
    (convertToSixChars(color || defaultColor).match(/../g) ?? []).map((
      c,
      i,
    ) => ["rgb".charAt(i), parseInt("0x" + c)]),
  );
}

function hexStrToHexNum(
  color: string,
  defaultColor = defaultPixelColor,
): number {
  return parseInt("0x" + convertToSixChars(color || defaultColor));
}

export { confirmHex, convertToSixChars, hexStrToHexNum, hexStrToRgbObj };
