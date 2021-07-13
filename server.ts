/// <reference path="./deploy.d.ts" />

import { getContributions } from "./contributions.ts";
import env from "./env.ts";

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
      `Access to ${host}/[username] to get your contributions data`,
    ].reduce((acc, current) => acc + current + "\n", "");
  }

  const paths = pathname.split("/");
  if (paths.length > 2) {
    throw new Error(`Invalid path. Access to ${host}/[username]`);
  }
  const username = paths[1].replace(/\..*$/, "");
  const ext = getPathExtension(request);

  const contributions = await getContributions(
    username,
    env("GH_READ_USER_TOKEN"),
  );

  const scheme = searchParams.get("scheme") ?? "github";
  const pixel = searchParams.get("pixel") ?? undefined;
  const noTotal = searchParams.get("no-total") == "true";
  const noLegend = searchParams.get("no-legend") == "true";
  const flat = searchParams.get("flat") == "true";
  const invert = searchParams.get("invert") == "true";

  if (ext === "json") {
    return contributions.toJson({ flat });
  }

  if (ext === "term") {
    return contributions.toTerm({ scheme, pixel, noTotal, noLegend, invert });
  }

  if (ext === "text") {
    return contributions.toText({ noTotal });
  }

  // const svg = Svg.render([], getColorScheme().hexColors);
  // return new Response(svg, {
  //   headers: { "content-type": "image/svg+xml; charset=utf-8" },
  // });

  return [
    `${contributions.totalContributions} contributions in the last year.`,
    "",
    `Use extensions like as '${host}/${username}.text'`,
    " - .json : return data as json",
    " - .term : return data as colored pixels graph (works in the terminal with true color)",
    " - .text : return data as table-styled text",
    // " - .svg  : coming soon!",
    "",
    "You can use other parameters",
    " - no-total=true  : remove total contributions count (except type=json)",
    " - no-legend=true : remove legend (only type=term)",
    " - flat=true      : return contributions as one-dimensional array (only type=json)",
    " - invert=true    : invert the background and foreground colors (only type=json)",
    " - scheme=[name]  : use specific color scheme (only type=term)",
    " - pixel=[char]   : use the character as pixels (url encoding may required, only type=term)",
  ].reduce((acc, current) => acc + current + "\n", "");
}

addEventListener("fetch", async (event) => {
  const ext = getPathExtension(event.request);
  const type = ext == "json" ? "application/json" : "text/plain";
  const headers = { "content-type": `${type}; charset=utf-8` };

  try {
    const body = await handleRequest(event.request);
    event.respondWith(new Response(body, { headers }));
  } catch (error) {
    console.error(error);

    const body = ext == "json"
      ? JSON.stringify({ error: error.toString() })
      : error;
    event.respondWith(
      new Response(body, {
        status: 400,
        headers,
      }),
    );
  }
});
