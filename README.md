# deno-github-contributions-api

Get your GitHub contributions data powered by deno!

![gif](https://github.com/kawarimidoll/deno-github-contributions-api/raw/main/t-rec.gif)

## Usage

### as API

In your terminal:

```
$ curl https://github-contributions-api.deno.dev
# Then follow the messages...
```

### as deno module

In your deno script file:

```ts
import { getContributions } from "https://github.com/kawarimidoll/deno-github-contributions-api/raw/main/mod.ts";

const username = "your-github-username";
const token = "xxxxxxxxxxxxxxxxxxxxxxx";

const contributions = await getContributions(username, token);

console.log(contributions.toTerm({ scheme: "random" }));
```

You can see an example in
[main.ts](https://github.com/kawarimidoll/deno-github-contributions-api/blob/main/main.ts)

The personal access token which has a "read:user" scope is required.

Generate your token from this page: https://github.com/settings/tokens/new

## TODO

- add more tests
- add SVG API
