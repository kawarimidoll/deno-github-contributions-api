import { contributions } from "./contributions.ts";
import env from "./env.ts";
import h from "./tag.ts";
import { Svg } from "./svg.ts";
import { getColorScheme } from "./color_scheme.ts";

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
    const graph = await contributions(
      "kawarimidoll",
      env("GITHUB_READ_USER_TOKEN"),
      {
        scheme: searchParams.get("scheme") ?? "",
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
