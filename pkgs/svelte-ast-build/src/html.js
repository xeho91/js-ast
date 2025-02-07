/**
 * Related to {@link HTMLNode}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * @typedef {AST.Comment | AST.Text} HTMLNode AST nodes related to native HTML.
 */

/**
 * Set containing all of the types related to native HTML AST nodes.
 * @type {Set<HTMLNode['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_HTML = new Set([
	//
	"Comment",
	"Text",
]);

/**
 * Type check guard to see if provided AST node is a native HTML related.
 *
 * Those are:
 *
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 *
 * @param {AST.BaseNode} node
 * @returns {node is HTMLNode}
 * @__NO_SIDE_EFFECTS__
 */
export function isHTML(node) {
	return (
		TYPES_HTML
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
