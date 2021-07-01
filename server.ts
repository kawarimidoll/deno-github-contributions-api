import h from "./tag.ts";

function handleRequest(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
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
        h("p", {}, "Access to /[username] to get your contributions graph"),
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
    return new Response(message, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const width = 100;
  const height = 100;
  const svg = h(
    "svg",
    { width, height, xmlns: "http://www.w3.org/2000/svg", id: "graph" },
    h("rect", { width, height, fill: "#a63" }),
  );
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml; charset=utf-8" },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
