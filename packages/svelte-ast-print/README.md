# `svelte-ast-print`

![NPM Version](https://img.shields.io/npm/v/svelte-ast-print?style=for-the-badge&logo=npm)

Print _(serialize)_ **Svelte [AST]** nodes into stringified syntax.\
A.k.a. [`parse`] in reverse.

## Documentation

<https://xeho91.github.io/svelte-ast-print>

## Acknowledgements

This package depends on:

1. [`esrap`] for printing [ESTree] specification-compliant [AST] nodes
1. [`zimmerframe`] for walking on the [AST] nodes

## Limitations

> [!IMPORTANT] > **It ignores any previous formatting**.\
> The current focus is to be able to write codemods as soon as possible - because right now, there are no alternatives.
>
> If you need to format modified and stringified Svelte AST, use available formatters for Svelte:
>
> -   [Biome](https://github.com/biomejs/biome) - _⚠️ has partial support_
> -   [Prettier](https://github.com/prettier/prettier) with [`prettier-plugin-svelte`](https://github.com/sveltejs/prettier-plugin-svelte)
>
> See [Formatting](#formatting) section for examples.

## Getting started

1. Use the package manager of your choice to install this package:

    <details>
        <summary>npm</summary>

    ```sh
    npm install svelte-ast-print
    ```

    </details>

    <details>
        <summary>yarn</summary>

    ```sh
    yarn add svelte-ast-print
    ```

    </details>

    <details>
        <summary>pnpm</summary>

    ```sh
    pnpm add svelte-ast-print
    ```

    </details>

    <details>
        <summary>bun</summary>

    ```sh
    bun add svelte-ast-print
    ```

    </details>

1. Incorporate it into your project, for example using Node.js and with the Svelte [`parse`] method:

    ```ts
    import fs from "node:fs";

    import { print } from "svelte-ast-print";
    import { parse } from "svelte/compiler";

    const originalSvelteCode = fs.readFileSync("src/App.svelte", "utf-8");
    let svelteAST = parse(originalSvelteCode, { modern: true });
    //                                          👆 For now, only modern is supported.
    //                                             By default is 'false'.
    //                                             Is it planned to be 'true' from Svelte v6+

    // ...
    // Do some modifications on this AST...
    // e.g. transform `<slot />` to `{@render children()}`
    // ...

    const output = print(svelteAST); // AST is now a stringified code output! 🎉

    fs.writeFileSync("src/App.svelte", output, { encoding: " utf-8" });
    ```

> [!IMPORTANT]
> When using [`parse`] from `svelte`, please remember about passing `modern: true` to options _(second argument)_.
> This option is only available starting `svelte@5`\
> Example:
>
> ```js
> import { parse } from "svelte/compiler";
>
> parse(code, { modern: true });
> //          👆 Don't forget about this
> ```
>
> You can omit it from Svelte `v6` - [source](https://github.com/sveltejs/svelte/blob/5a05f6371a994286626a44168cb2c02f8a2ad567/packages/svelte/src/compiler/index.js#L99-L100).

---

## Formatting

Until the package will support formatting feature option... below are the current and **simplified** workaround examples
on how to get printed output formatted to your needs.

### Prettier

Two dependencies are required:

1. [`prettier`](https://github.com/prettier/prettier)
1. [`prettier-plugin-svelte`](https://github.com/sveltejs/prettier-plugin-svelte)

Follow `prettier-plugin-svelte` [Setup guide](https://github.com/sveltejs/prettier-plugin-svelte?tab=readme-ov-file#setup)
on how to configure Prettier for Svelte.

#### Using Prettier API

```js
import { format } from "prettier";
import { parse } from "svelte/compiler";
import { print } from "svelte-ast-print";

let code = "..." // 👈 Raw Svelte code
let ast = parse(code, { modern: true });
//                    👆 Don't forget about this, you can omit in Svelte v6

// .. work with AST - transformations, etc. ...

const output = print(ast);
const formatted = await format(output {
	// Two ways to provide options:

	// 1. provide file path to prettier config
	filepath: "path/to/your/prettier/config/file",

	// or..

	// 2. See `prettier-plugin-svelte` Setup guide for more info
	parser: "svelte",
	plugins: ["svelte-plugin-prettier"]
});
```

#### Using Prettier CLI

... and Node.js API.

```js
import fs from "node:fs";
import childProcess from "node:child_process";

import { parse } from "svelte/compiler";
import { print } from "svelte-ast-print";

const code = fs.readFileSync("./Button.svelte", "utf-8");
let ast = parse(code, { modern: true });
//                    👆 Don't forget about this, you can omit in Svelte v6

// .. work with AST - transformations, etc. ...

const output = print(ast);

fs.writeFileSync("./Button.svelte", output, "utf-8");
childProcess.spawnSync("prettier", ["./Button.svelte", "--write"], {
	stdio: "inherit",
	encoding: "utf-8",
});
```

### Biome

> [!WARNING]
> This sub-section is incomplete. Feel free to contribute!

---

## Contributing

Take a look at [contributing guide](./.github/CONTRIBUTING.md).

## Support

If you don't have time, but you need this project to work, or resolve an existing issue, consider [sponsorship](https://github.com/sponsors/xeho91).

## Author

Mateusz "[xeho91](https://github.com/xeho91)" Kadlubowski

<!-- links -->

[`esrap`]: https://github.com/rich-harris/esrap
[`zimmerframe`]: https://github.com/rich-harris/zimmerframe
[ESTree]: https://github.com/estree/estree
[codemods]: https://codemod.com/blog/what-are-codemods#ill-find-replace-whats-the-issue-hint-a-lot
[`parse`]: https://svelte.dev/docs/svelte-compiler#parse
[AST]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
