const GITHUB_READ_USER_TOKEN = Deno.env.get("GITHUB_READ_USER_TOKEN") ?? "";

if (!GITHUB_READ_USER_TOKEN) {
  throw new Error("No token!");
}

export { GITHUB_READ_USER_TOKEN };
