/// <reference path="./_deploy.d.ts" />

import { getContributions } from "./contributions.ts";
import { env } from "./deps.ts";

// cache one hour
const CACHE_MAX_AGE = 3600;

function getPathExtension(request: Request): string {
  const { pathname } = new URL(request.url);
  const split = pathname.split(".");
  return split.length > 1 ? split[split.length - 1] : "";
}

async function handleRequest(request: Request) {
  const { pathname, searchParams, host } = new URL(request.url);

  if (pathname === "/") {
    return [
      "Welcome to deno-github-contributions-api!",
      `Access to ${host}/[username] to get your contributions data.`,
    ].join("\n");
  }

  const paths = pathname.split("/");
  if (paths.length > 2) {
    throw new Error(
      `'${request.url}' is invalid path. Access to ${host}/[username].`,
    );
  }
  const username = paths[1].replace(/\..*$/, "");
  const ext = getPathExtension(request);

  const toYmd = searchParams.get("to") ?? null;
  const fromYmd = searchParams.get("from") ?? null;
  const from = fromYmd ? new Date(fromYmd).toISOString() : undefined;
  const to = toYmd ? new Date(toYmd).toISOString() : undefined;

  const contributions = await getContributions(
    username,
    env.require("GH_READ_USER_TOKEN"),
    { from, to },
  );

  const scheme = searchParams.get("scheme") ?? "github";
  const pixel = searchParams.get("pixel") ?? undefined;
  const noTotal = searchParams.get("no-total") == "true";
  const noLegend = searchParams.get("no-legend") == "true";
  const flat = searchParams.get("flat") == "true";
  const invert = searchParams.get("invert") == "true";
  const fontColor = searchParams.get("font-color") ?? "#000";
  const frame = searchParams.get("frame") ?? "none";
  const bg = searchParams.get("bg") ?? "none";

  if (ext === "json") {
    return contributions.toJson({ flat });
  }

  if (ext === "term") {
    return contributions.toTerm({ scheme, pixel, noTotal, noLegend, invert });
  }

  if (ext === "text") {
    return contributions.toText({ noTotal });
  }

  if (ext === "svg") {
    return contributions.toSvg({
      scheme,
      noTotal,
      noLegend,
      frame,
      bg,
      fontColor,
    });
  }

  return [
    `${contributions.totalContributions} contributions in the last year.`,
    "",
    `Use extensions like as '${host}/${username}.text'.`,
    " - .json : return data as a json",
    " - .term : return data as a colored pixels graph (works in the terminal with true color)",
    " - .text : return data as a table-styled text",
    " - .svg  : return data as a svg image",
    "",
    "You can use other parameters. Each of them works on specific extensions.",
    " - no-total=true      : remove total contributions count (term/text/svg)",
    " - no-legend=true     : remove legend (term/svg)",
    " - invert=true        : change the background colors instead of the foreground colors (term)",
    " - flat=true          : return contributions as one-dimensional array (json)",
    " - scheme=[name]      : use specific color scheme (term/svg)",
    " - pixel=[char]       : use the character as pixels, URL encoding is required (term)",
    " - frame=[color]      : use the color as a frame of image (svg)",
    " - bg=[color]         : use the color as a background of image (svg)",
    " - font-color=[color] : use the color as a font color (svg)",
    " - from=[yyyy-mm-dd]  : get contributions from the date (term/text/svg/json)",
    " - to=[yyyy-mm-dd]    : get contributions to the date (term/text/svg/json)",
    "",
    "Color parameters allows hex color string without # like '123abc'.",
  ].join("\n");
}

addEventListener("fetch", async (event) => {
  const ext = getPathExtension(event.request);
  const type = {
    json: "application/json",
    svg: "image/svg+xml",
  }[ext] || "text/plain";
  const headers = {
    "Content-Type": `${type}; charset=utf-8`,
    "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
  };

  try {
    const body = await handleRequest(event.request);
    event.respondWith(new Response(body, { headers }));
  } catch (error) {
    console.error(error);

    const body = ext == "json"
      ? JSON.stringify({ error: `${error}` })
      : `${error}`;
    event.respondWith(
      new Response(body, {
        status: 400,
        headers,
      }),
    );
  }
});
