/**
 * Related to {@link AST.Fragment}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for fragment AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_FRAGMENT = "Fragment";
/**
 * @param {AST.BaseNode | AST.Fragment} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Fragment}
 * @__NO_SIDE_EFFECTS__
 */
export function isFragment(node) {
	return node.type === TYPE_FRAGMENT;
}
