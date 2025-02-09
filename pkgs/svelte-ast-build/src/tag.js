/**
 * Related to {@link AST.Tag}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "./_shared.js";

/**
 * Set containing all of the types related to Svelte tags only.
 * The ones with pattern `{@<tag-name>}`.
 * Exception is only {@link AST.ExpressionTag} which follows pattern `{<expression>}`
 *
 * @type {Set<AST.Tag['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_TAG = new Set([
	//
	"ExpressionTag",
	"HtmlTag",
	"ConstTag",
	"DebugTag",
	"RenderTag",
]);

/**
 * Type check guard to see if provided AST node is "tag-like".
 * The ones with pattern `{@<tag-name>}`.
 * Exception is only {@link AST.ExpressionTag} which follows pattern `{<expression>}`
 *
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Tag}
 * @__NO_SIDE_EFFECTS__
 */
export function isTag(node) {
	return (
		is_base_node(node) &&
		TYPES_TAG
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
