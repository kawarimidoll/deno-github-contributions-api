export default function (envName: string) {
  const envValue = Deno.env.get(envName);

  if (!envValue) {
    throw new Error(`No token: ${envName}`);
  }

  return envValue;
}
