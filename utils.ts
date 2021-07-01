const hexToRgbObj = (color = "000000") =>
  Object.fromEntries(
    (color.replace(/^#?(.*)$/, (_, hex) =>
      (hex.length == 3) ? hex.replace(/./g, "$&$&") : hex)
      .match(/../g) ?? []).map((c, i) => ["rgb".charAt(i), parseInt("0x" + c)]),
  ) as { r: number; g: number; b: number };

const hexToRgbNum = (color = "000000") =>
  parseInt(
    "0x" + color.replace(
      /^#?(.*)$/,
      (_, hex) => (hex.length == 3) ? hex.replace(/./g, "$&$&") : hex,
    ),
  );

export { hexToRgbNum, hexToRgbObj };
