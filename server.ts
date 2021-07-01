addEventListener("fetch", (event) => {
  const response = new Response("Hello Deno Deploy", {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});
