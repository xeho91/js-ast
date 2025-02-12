/**
 * @import { AST } from "svelte/compiler";
 * @import { PrintOptions } from "./_internal/option.js";
 */

/**
 * ## Usage
 *
 * There are two ways to use this package.
 *
 * @example Recommended usage
 *
 * If you know which _specific_ AST node from Svelte syntax you want to print. For example {@link AST.SnippetBlock}.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { printSvelteSnippet } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.SnippetBlock;
 *
 * const stringified = printSvelteSnippet(node);
 * ```
 *
 * @example General usage
 *
 * If you _don't know_ which AST node from Svelte syntax you want to print.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { print } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.BaseNode;
 *
 * const stringified = print(node);
 * ```
 *
 * ---
 *
 * ## Options
 *
 * Every `print*` function accepts a second argument for options. Is optional and has some sensible defaults.
 *
 * @see {@link PrintOptions}
 *
 * @module svelte-ast-print
 */

export * from "./css/mod.js";
export * from "./js/mod.js";
export * from "./html/mod.js";
export * from "./template/mod.js";
