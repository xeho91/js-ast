# `js-ast`

This is a monorepo with packages to **boost the [DX]** of working with [AST] _(using [JavaScript] programming language)_ related to:

- ![JavaScript icon][icon-js] [JavaScript]
- ![TypeScript icon][icon-ts] [TypeScript]
- ![Svelte icon][icon-svelte] [Svelte]

---

## Core goals

1. [DX] friendly.
1. **Cross-runtime** friendly—👈 this also means [ESM] only.
1. [e18e] friendly.
1. Extensive tests and benchmarks.

---

## Packages

In order to work with AST, the following processes are recognized:

1. [Parsing](#parse) _stringified_ code syntax into [AST] object.
1. [Traversing](#traverse) the [AST] object.
1. [Analyzing](#analyze) the [AST] object(s).
1. [Building](#build) programmatically the [AST] node(s), or an entire object.
1. [Printing](#print) the [AST] object back into _stringified_ code syntax.

> [!IMPORTANT]
>
> The following lists of packages contains **what you can combine together - based on shared [AST] node interface format - aligned with [ESTree] specification**.

> [!NOTE]
>
> Not all of these packages are part of this monorepo.

### Parse

Getting the [AST] object from stringified code syntax.

| Name                | Languages            | In this repository? |
| ------------------- | -------------------- | ------------------- |
| [`@swc/core`]       | ![icon-js]![icon-ts] | ❌                  |
| [`svelte/compiler`] | ![icon-svelte]       | ❌                  |

### Traverse

In other words, _walk_ on the AST object.

| Name            | Languages                          | In this repository? |
| --------------- | ---------------------------------- | ------------------- |
| [`zimmerframe`] | ![icon-js]![icon-ts]![icon-svelte] | ❌                  |

### Analyze

Analyze the received [AST] object(s). Contains type-guards and utilities.

| Name                   | Languages                          | In this repository? |
| ---------------------- | ---------------------------------- | ------------------- |
| [`js-ast-analyze`]     | ![icon-js]                         | ✅                  |
| [`ts-ast-analyze`]     | ![icon-js]![icon-ts]               | ✅                  |
| [`svelte-ast-analyze`] | ![icon-js]![icon-ts]![icon-svelte] | ✅                  |

### Build

Sometimes you need to do some code transformation...

| Name                 | Languages      | In this repository? |
| -------------------- | -------------- | ------------------- |
| [`js-ast-build`]     | ![icon-js]     | ✅                  |
| [`ts-ast-build`]     | ![icon-ts]     | ✅                  |
| [`svelte-ast-build`] | ![icon-svelte] | ✅                  |

### Print

Print the [AST] object or nodes into stringified code syntax.

| Name                 | Languages                          | In this repository? |
| -------------------- | ---------------------------------- | ------------------- |
| [`esrap`]            | ![icon-js]![icon-ts]               | ❌                  |
| [`svelte-ast-print`] | ![icon-js]![icon-ts]![icon-svelte] | ✅                  |

---

## Contributing

If you can offer your time - refer to [Contribution Guide](/.github/CONTRIBUTING.md).

Otherwise, consider [sponsoring me](https://github.com/sponsors/xeho91).

## Author

Mateusz "[xeho91](https://github.com/xeho91)" Kadlubowski

<!-- LINKS -->

[icon-js]: https://api.iconify.design/logos:javascript.svg
[icon-ts]: https://api.iconify.design/logos:typescript-icon-round.svg
[icon-svelte]: https://api.iconify.design/logos:svelte-icon.svg
[AST]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[DX]: https://en.wikipedia.org/wiki/User_experience#Developer_experience
[ESTree]: https://github.com/estree/estree
[e18e]: https://github.com/e18e/e18e
[ESM]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[`js-ast-analyze`]: ./pkgs/js-ast-build
[`js-ast-build`]: ./pkgs/js-ast-build
[`svelte-ast-analyze`]: ./pkgs/js-ast-build
[`svelte-ast-build`]: ./pkgs/svelte-ast-build
[`svelte-ast-print`]: ./pkgs/svelte-ast-print
[`ts-ast-analyze`]: ./pkgs/js-ast-build
[`ts-ast-build`]: ./pkgs/ts-ast-build
[`@swc/core`]: https://github.com/swc-project/swc
[`svelte/compiler`]: https://github.com/sveltejs/svelte
[`zimmerframe`]: https://github.com/Rich-Harris/zimmerframe
[`esrap`]: https://github.com/sveltejs/esrap
[Svelte]: https://github.com/sveltejs/svelte
[TypeScript]: https://github.com/microsoft/TypeScript
[JavaScript]: https://en.wikipedia.org/wiki/JavaScript
