function handleRequest(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  console.log({ pathname, searchParams });

  if (pathname === "/") {
    const html = `<html>
    <p>Welcome to deno-github-contributions-api!</p>
    <p>Access to /[username] to get your contributions graph</p>
    </html>`;
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

  return new Response(message, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
