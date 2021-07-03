import { contributions } from "./contributions.ts";
import env from "./env.ts";
import h from "./tag.ts";
import { Svg } from "./svg.ts";
import { COLOR_SCHEMES, getColorScheme } from "./color_scheme.ts";

async function handleRequest(request: Request) {
  const { pathname, searchParams, host } = new URL(request.url);
  // console.log({ pathname, searchParams });

  if (pathname === "/") {
    const html = h(
      "html",
      {},
      h("head", {}, h("title", {}, "deno-github-contributions-api")),
      h(
        "body",
        {},
        h("p", {}, "Welcome to deno-github-contributions-api!"),
        h(
          "p",
          {},
          `Access to ${host}/[username] to get your contributions graph`,
        ),
      ),
    );
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const message = `username: ${pathname.slice(1)}`;

  if (searchParams.get("type") === "json") {
    return new Response(JSON.stringify({ message }), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (searchParams.get("type") === "text") {
    const scheme = searchParams.get("scheme") ?? "github";
    if (!COLOR_SCHEMES[scheme]) {
      console.log("invalid color scheme name");

      return new Response("invalid color scheme name", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    const graph = await contributions(
      "kawarimidoll",
      env("GITHUB_READ_USER_TOKEN"),
      {
        scheme,
        total: searchParams.get("total") != "none",
        legend: searchParams.get("legend") != "none",
      },
    );
    return new Response(graph, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const svg = Svg.render([], getColorScheme().hexColors);
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml; charset=utf-8" },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
