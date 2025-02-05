# `svelte-ast-print`

![NPM Version](https://img.shields.io/npm/v/svelte-ast-print?style=for-the-badge&logo=npm)

Print _(serialize)_ **[Svelte] [AST]** nodes into stringified code syntax.\
A.k.a. [`parse()`] in reverse.

## Usage

```ts
import { parse } from "svelte/compiler";
import { print } from "svelte-ast-print";

const input = `
<script>
	export let x;
	export let y;
</script>

<slot {x} {y} />
`;

let ast = parse(input, { modern: true });
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
//                     👆 Only modern is supported.
//                        In Svelte `v5` by default is 'false'.
//                        Is it planned to be 'true' from `v6`.
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

// ...
// Do some modifications on this AST...
// e.g. transform `<slot />` to `{@render children()}`
// ...

const output = print(ast); // AST is now in a stringified code syntax! 🎉
```

> [!IMPORTANT]
>
> When using [`parse()`] from `"svelte/compiler"`...\
> **please remember about passing `modern: true` to options** _(second argument)_.
>
> This option is only available starting `svelte@5`.
>
> Example:
>
> ```js
> import { parse } from "svelte/compiler";
>
> parse(code, { modern: true });
> //          👆 Don't forget about this
> ```
>
> You can omit it from [Svelte] `v6` - [source](https://github.com/sveltejs/svelte/blob/5a05f6371a994286626a44168cb2c02f8a2ad567/packages/svelte/src/compiler/index.js#L99-L100).

### Options

TODO: Add link to doc options

---

## How does it work under the hood?

1. It determines whether the provided AST node `type` is related to [Svelte] syntax only.
1. Based on node's `type` check from above:

    a. it uses either this package's printer to print [AST] node related to [Svelte] syntax,
    b. otherwise it uses [`esrap`] to print [ESTree] specification-complaint [AST] node.

---

## Author

Mateusz "[xeho91](https://github.com/xeho91)" Kadlubowski

### Acknowledgements

- [@manuel3108](https://github.com/manuel3108) for bringing TypeScript support to [`esrap`]

<!-- links -->

[Svelte]: https://github.com/sveltejs/svelte
[`esrap`]: https://github.com/rich-harris/esrap
[`zimmerframe`]: https://github.com/rich-harris/zimmerframe
[ESTree]: https://github.com/estree/estree
[codemods]: https://codemod.com/blog/what-are-codemods#ill-find-replace-whats-the-issue-hint-a-lot
[`parse()`]: https://svelte.dev/docs/svelte-compiler#parse
[AST]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
