/**
 * Related to {@link AST.Fragment}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "./_shared.js";

/**
 * Reusable constant for fragment AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_FRAGMENT = "Fragment";
/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Fragment}
 * @__NO_SIDE_EFFECTS__
 */
export function isFragment(node) {
	return is_base_node(node) && node.type === TYPE_FRAGMENT;
}
