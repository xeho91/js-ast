/**
 * Related to {@link AST.Tag}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "./_shared.js";

/**
 * Reusable constant for `{@const <declaration>}` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TAG_CONST = "ConstTag";
/**
 * Type check guard to see if the input is {@link SV.ConstTag}.
 *
 * @param {unknown} n - input
 * @returns {n is AST.ConstTag}
 * @__NO_SIDE_EFFECTS__
 */
export function isConstTag(n) {
	return isTag(n) && n.type === TYPE_TAG_CONST;
}

/**
 * Reusable constant for `{@debug <identifiers[]>}` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TAG_DEBUG = "DebugTag";
/**
 * Type check guard to see if the input is {@link SV.DebugTag}.
 *
 * @param {unknown} n - input
 * @returns {n is AST.DebugTag}
 * @__NO_SIDE_EFFECTS__
 */
export function isDebugTag(n) {
	return isTag(n) && n.type === TYPE_TAG_DEBUG;
}

/**
 * Reusable constant for `{<expression>}` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TAG_EXPRESSION = "ExpressionTag";
/**
 * Type check guard to see if the input is {@link SV.ExpressionTag}.
 *
 * @param {unknown} n - input
 * @returns {n is AST.ExpressionTag}
 * @__NO_SIDE_EFFECTS__
 */
export function isExpressionTag(n) {
	return isTag(n) && n.type === "ExpressionTag";
}

/**
 * Reusable constant for `{@html <expression>}` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TAG_HTML = "HtmlTag";
/**
 * Type check guard to see if the input is {@link SV.HtmlTag}.
 *
 * @param {unknown} n - input
 * @returns {n is AST.HtmlTag}
 * @__NO_SIDE_EFFECTS__
 */
export function isHtmlTag(n) {
	return isTag(n) && n.type === TYPE_TAG_HTML;
}

/**
 * Reusable constant for `{@debug <identifiers[]>}` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TAG_RENDER = "RenderTag";
/**
 * Type check guard to see if the input is {@link SV.RenderTag}.
 *
 * @param {unknown} n - input
 * @returns {n is AST.RenderTag}
 * @__NO_SIDE_EFFECTS__
 */
export function isRenderTag(n) {
	return isTag(n) && n.type === TYPE_TAG_RENDER;
}

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
	TYPE_TAG_CONST,
	TYPE_TAG_DEBUG,
	TYPE_TAG_EXPRESSION,
	TYPE_TAG_HTML,
	TYPE_TAG_RENDER,
]);

/**
 * Type check guard to see if provided AST node is "tag-like".
 * The ones with pattern `{@<tag-name>}`.
 * Exception is only {@link AST.ExpressionTag} which follows pattern `{<expression>}`
 *
 * @param {unknown} n - input
 * @returns {n is AST.Tag}
 * @__NO_SIDE_EFFECTS__
 */
export function isTag(n) {
	return (
		is_base_node(n) &&
		TYPES_TAG
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(n.type)
	);
}
