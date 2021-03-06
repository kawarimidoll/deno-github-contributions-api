# deno-github-contributions-api

[![ci](https://github.com/kawarimidoll/deno-github-contributions-api/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno deploy](https://img.shields.io/badge/deno-deploy-blue?logo=deno)](https://github-contributions-api.deno.dev)
[![deno.land](https://img.shields.io/badge/deno-%5E1.13.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Get your GitHub contributions data powered by Deno!

![gif](resources/t-rec.gif)

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

## Extra

If you are using [GitHub CLI](https://github.com/cli/cli), you can call this API
from [gh-graph](https://github.com/kawarimidoll/gh-graph).

<details>
  <summary>Acknowledgements</summary>
  <a href="https://twitter.com/deno_land/status/1420387162206478340">
    <img src="resources/tweet.webp" alt="tweet">
  </a>
</details>

<!-- ## TODO               -->
<!-- - add more tests      -->
<!-- - add Month/Day names -->

---

```ts
if (this.repo.isAwesome || this.repo.isHelpful) {
  star(this.repo);
}
```

<!-- this part is inspired by https://github.com/bhumijgupta/Deno-news-cli -->
