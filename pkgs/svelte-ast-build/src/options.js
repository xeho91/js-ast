/**
 * Related to {@link AST.SvelteOptions}.
 * @module
 */

import { is_base_node } from "./_shared.js";

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for `<svelte:options>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_OPTIONS = "SvelteOptions";

/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.SvelteOptionsRaw & AST.SvelteOptions}
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteOptions(node) {
	return is_base_node(node) && node.type === TYPE_SVELTE_OPTIONS;
}
