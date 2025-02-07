/**
 * Related to {@link AST.Root}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "./_shared.js";

/**
 * Reusable constant for root AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ROOT = "Root";

/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Root}
 * @__NO_SIDE_EFFECTS__
 */
export function isRoot(node) {
	return is_base_node(node) && node.type === TYPE_ROOT;
}
