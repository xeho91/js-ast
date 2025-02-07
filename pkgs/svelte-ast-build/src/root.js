/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for root AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ROOT = "Root";

/**
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Root}
 * @__NO_SIDE_EFFECTS__
 */
export function isRoot(node) {
	return node.type === TYPE_ROOT;
}
