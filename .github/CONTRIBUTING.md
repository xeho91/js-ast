# Contribution guide

Contributions of any kind is welcome. There are several ways on how you can do it.\
Keep in mind that this project has [Code of Conduct](https://github.com/xeho91/svelte-ast-print?tab=coc-ov-file).

## Documentation

<details>
<summary>This section covers documenting part.</summary>

![TypeDoc coverage status](https://xeho91.github.io/svelte-ast-print/coverage.svg)

This project uses [TypeDoc], which under the hood uses [JSDoc].\
You're free to:

- improve wording,
- fix typos,
- add some examples,
- and everything else that is related to improving the documentation.

</details>

## Development

<details>
<summary>This section covers development part.</summary>

### Setup

[![badge-pnpm]][pnpm] [![badge-nx]][Nx]

If you intend to setup this project locally, ensure you have right prerequisites from below table:

#### Prerequisites

You must have those tools installed.

| Importance | Dependency | Version                                              |
| ---------- | ---------- | ---------------------------------------------------- |
| ❗required | [Node.js]  | LTS                                                  |
| ❗required | [pnpm]     | Use `corepack enable` to automatically setup version |

---

#### Step by step

1. Clone this repository.

1. Setup package manager for [Node.js] with [corepack]:

    ```sh
    corepack enable
    ```

1. Install project dependencies with pnpm:

    ```sh
    pnpm install
    ```

1. Take a look at the `"scripts"` in [`../package.json`](../package.json#scripts) to see if you can find what you need.

### Code style

[![badge-biome]][Biome]

Most of the style issues will be caught by [Biome].

#### Convention

1. **`snake_case` for internal** variable names and methods.
1. **`camelCase` for public** variable names and methods.

### Pull Requests and commits

[![badge-conventional-commits]][Conventional Commits]

We use [trunk based development](https://trunkbaseddevelopment.com/) flow.

tl;dr:

1. **Pull Request(s) title is important.** Needs to follow [Conventional Commits] specification.
2. **We don't care about the commits messages inside the Pull Request(s)** - during merge to the main branch(es), the entire history will be _squashed_ into one.

### Writing changelogs

[![badge-changesets]][changesets]

This project uses [changesets] to manage changelogs.

#### Convention

[![badge-conventional-commits]][Conventional Commits]

For the consistency, use [Conventional Commits] specifications _for the changesets description_.

</details>

[Biome]: https://github.com/biomejs/biome
[changesets]: https://github.com/changesets/changesets
[Conventional Commits]: https://www.conventionalcommits.org/
[corepack]: https://github.com/nodejs/corepack
[JSDoc]: https://github.com/jsdoc/jsdoc
[Node.js]: https://github.com/nodejs/node
[Nx]: https://github.com/nrwl/nx
[pnpm]: https://github.com/pnpm/pnpm
[TypeDoc]: https://github.com/TypeStrong/typedoc
[typos]: https://github.com/crate-ci/typos
[badge-biome]: https://img.shields.io/badge/-biome-gray?style=for-the-badge&logo=biome
[badge-changesets]: https://img.shields.io/badge/-changesets-gray?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAKCAYAAACE2W/HAAABYUlEQVQoU02RvUoDQRDHZ3b3TiwsjI0xWFjb+gIKoqIIKUSCCjY+ho3voO9gF7wq+AaBVOJXY4JaCH5FMSbeJTf+Z3OeWVhmv37zn/kvCwYR6dTBmA1mXsj2Pmyed+6N4dkgdBJYQ4Eh5gzU+1EYN6xJaDFqi3NGAQ6cHYIOJECD+36mJikWMVJ0cbISvfns+tgFVkJrCUkoWho3PivgC4T5eEAcY9sbEPX6xOvRMxQYChYJGAmwHrO12vLEqgcz2LYTSgCxgl3McvQkoQJQc1CtlwtWu/szY9QHuvuS9Af1dlDqVvWRh4YwXVamtaV85Ip6cvspolCckkCRt88eJIRJXtEYut75h3Pw6kMEpghM4QTxG3G32hLfn/bmezR0szfjmRxsvEvaTQBl5qwV2Zc2ddJM1ckQ7jrnpLlf8ucerL/KIUo7UlMAtjaKPDfaz+Rx8wV/V9D/C1JTaR2UTn8B1OeSRP02JSkAAAAASUVORK5CYII=
[badge-conventional-commits]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=for-the-badge
[badge-pnpm]: https://img.shields.io/badge/-pnpm%20workspace-informational?style=for-the-badge&logo=pnpm
[badge-nx]: https://img.shields.io/badge/-informational?style=for-the-badge&logo=nx
