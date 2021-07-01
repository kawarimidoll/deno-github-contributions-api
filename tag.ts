/** Generate XML tag. */
export default function (
  tagName: string,
  attributes: { [attr: string]: string | number },
  ...children: string[]
): string {
  const isVoidTag = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
  ].includes(tagName);

  const attrs = Object.entries(attributes)
    .reduce((acc, [k, v]) => `${acc} ${k}="${v}"`, "");

  const close = isVoidTag ? "" : `${children.join("")}</${tagName}>`;

  return `<${tagName}${attrs}>${close}`;
}
