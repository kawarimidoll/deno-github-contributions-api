# deno-github-contributions-api

[![ci](https://github.com/kawarimidoll/deno-github-contributions-api/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno deploy](https://img.shields.io/badge/deno-deploy-blue?logo=deno)](https://github-contributions-api.deno.dev)
[![deno.land](https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Get your GitHub contributions data powered by Deno!

![gif](https://github.com/kawarimidoll/deno-github-contributions-api/raw/main/t-rec.gif)

## Usage

### as API

In your terminal:

```
$ curl https://github-contributions-api.deno.dev
# Then follow the messages...
```

Of course, you can access the endpoint from the web browser:
https://github-contributions-api.deno.dev

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
- add Month/Day names

<!-- - add SVG API : Done! -->
<!-- - add CLI version : Pending... -->

---

```ts
if (this.repo.isAwesome || this.repo.isHelpful) {
  star(this.repo);
}
```

<!-- this part is inspired by https://github.com/bhumijgupta/Deno-news-cli -->
