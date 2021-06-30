# deno-dev-template

my deno template

## Run with Velociraptor

Need to install [Velociraptor](https://velociraptor.run/).

```
$ # install velociraptor
$ deno install -qAn vr https://deno.land/x/velociraptor/cli.ts
$ # for zsh
$ echo 'export PATH="/Users/kawarimidoll/.deno/bin:$PATH"' > ~/.zshrc
$ # for bash
$ # echo 'export PATH="/Users/kawarimidoll/.deno/bin:$PATH"' > ~/.bashrc
$ # install hook
$ vr
```

### Run main.ts

```
$ vr start
```

## Logger

Import from `logger.ts`.

```ts
import { Logger } from "./logger.ts";

Logger.debug("This log is debug!");
Logger.info("This log is info!");
Logger.warning("This log is warning!");
Logger.error("This log is error!");
```
