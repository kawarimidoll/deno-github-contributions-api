import { getContributions } from "./contributions.ts";
import env from "./env.ts";

async function handleRequest(request: Request) {
  const { pathname, searchParams, host } = new URL(request.url);

  if (pathname === "/") {
    const body = [
      "Welcome to deno-github-contributions-api!",
      `Access to ${host}/[username] to get your contributions graph`,
    ].reduce((acc, current) => acc + current + "\n", "");

    return { body, headers: { "content-type": "text/plain; charset=utf-8" } };
  }

  const username = pathname.slice(1);

  const contributions = await getContributions(
    username,
    env("GITHUB_READ_USER_TOKEN"),
  );

  if (searchParams.get("type") === "json") {
    const body = contributions.toJson();
    return {
      body,
      headers: { "content-type": "application/json; charset=utf-8" },
    };
  }

  const scheme = searchParams.get("scheme") ?? "github";
  const noTotal = searchParams.get("no-total") == "true";
  const noLegend = searchParams.get("no-legend") == "true";

  if (searchParams.get("type") === "term") {
    const body = contributions.toTerm({ scheme, noTotal, noLegend });
    return { body, headers: { "content-type": "text/plain; charset=utf-8" } };
  }

  if (searchParams.get("type") === "text") {
    const body = contributions.toText({ noTotal });
    return { body, headers: { "content-type": "text/plain; charset=utf-8" } };
  }

  // const svg = Svg.render([], getColorScheme().hexColors);
  // return new Response(svg, {
  //   headers: { "content-type": "image/svg+xml; charset=utf-8" },
  // });

  const body = [
    `Use type parameter like as '${host}/${username}?type=text'`,
    " - type=json : return data as json",
    " - type=term : return data as colored pixels (works in the terminal with true color)",
    " - type=text : return data as table-styled text (works in the terminal with wide window)",
    // " - type=svg  : coming soon!",
    "",
    "You can use other parameters",
    " - no-total=true  : remove total contributions count (except type=json)",
    " - no-legend=true : remove legend (only type=term)",
    " - scheme=[name]  : use other color scheme (only type=term)",
  ].reduce((acc, current) => acc + current + "\n", "");

  return {
    body,
    headers: { "content-type": "text/plain; charset=utf-8" },
  };
}

addEventListener("fetch", async (event) => {
  const { body, headers } = await handleRequest(event.request);
  event.respondWith(new Response(body, { headers }));
});
