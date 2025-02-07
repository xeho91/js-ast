/**
 * Related to {@link AST.SvelteOptions}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for `<svelte:options>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_OPTIONS = "SvelteOptions";

/**
 * @param {AST.BaseNode | AST.SvelteOptionsRaw | AST.SvelteOptions} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.SvelteOptionsRaw}
 * @__NO_SIDE_EFFECTS__
 * FIXME: Broken
 */
export function isSvelteOptions(node) {
	// @ts-expect-error - FIXME: It's confusing, why we have SvelteOptionsRaw and SvelteOptions?
	return node.type === TYPE_SVELTE_OPTIONS;
}
