/**
 * Barrel file to allow us creating one namespaced import.
 * @module
 *
 * @example Usage
 *
 * ```js
 * import * as sv from "svelte-ast-build";
 *
 * if (sv.isSvelteNode(node)) {
 *     console.log("You are using Svelte! 🧡")
 * }
 * ```
 */

export * from "./base.ts";
export * from "./css/mod.ts";
export * from "./html/mod.ts";
export * from "./js/mod.ts";
export * from "./node.ts";
export * from "./template/mod.ts";
