/** Generate XML tag. */
export type Attributes = { [attr: string]: string | number };

export function tag(
  tagName: string,
  attributes: Attributes,
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
