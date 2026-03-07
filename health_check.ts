const baseUrl = "https://github-contributions-api.deno.dev";

async function check(label: string, path: string) {
  console.log(label);
  const res = await fetch(`${baseUrl}/${path}`);
  if (!res.ok) throw new Error(`${label} failed: ${res.status}`);
  await res.text();
}

try {
  await check("Root", "");
  await check("User", "kawarimidoll");
  await check("Text", "kawarimidoll.text");
  await check("Json", "kawarimidoll.json");
  await check("Term", "kawarimidoll.term");
  await check("Svg", "kawarimidoll.svg");
  await check(
    "Parameters",
    "kawarimidoll.svg?scheme=random&no-total=true&bg=123abc",
  );

  console.log("System all green!");
} catch (error) {
  console.error(`${error}`);
  Deno.exit(1);
}
