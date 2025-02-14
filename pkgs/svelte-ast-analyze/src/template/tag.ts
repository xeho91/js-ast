/**
 * Related to {@link AST.Tag}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.ConstTag}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CONST_TAG = "ConstTag";
/**
 * Schema of {@link AST.ConstTag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const CONST_TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CONST_TAG),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isConstTag(input: unknown): input is AST.ConstTag {
	return v.is(CONST_TAG, input);
}

/**
 * Type literal for {@link AST.DebugTag}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_DEBUG_TAG = "DebugTag";
/**
 * Schema of {@link AST.DebugTag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const DEBUG_TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_DEBUG_TAG),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isDebugTag(input: unknown): input is AST.DebugTag {
	return v.is(DEBUG_TAG, input);
}

/**
 * Type literal for {@link AST.ExpressionTag}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_EXPRESSION_TAG = "ExpressionTag";
/**
 * Schema of {@link AST.ExpressionTag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const EXPRESSION_TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_EXPRESSION_TAG),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isExpressionTag(input: unknown): input is AST.ExpressionTag {
	return v.is(EXPRESSION_TAG, input);
}

/**
 * Type literal for {@link AST.HtmlTag}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_HTML_TAG = "HtmlTag";
/**
 * Schema of {@link AST.HtmlTag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const HTML_TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_HTML_TAG),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isHtmlTag(input: unknown): input is AST.HtmlTag {
	return v.is(HTML_TAG, input);
}

/**
 * Type literal for {@link AST.RenderTag}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_RENDER_TAG = "RenderTag";
/**
 * Schema of {@link AST.RenderTag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const RENDER_TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_RENDER_TAG),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isRenderTag(input: unknown): input is AST.RenderTag {
	return v.is(RENDER_TAG, input);
}

/**
 * Set containing all of the types related to Svelte tags only.
 * The ones with pattern `{@<tag-name>}`.
 * Exception is only {@link AST.ExpressionTag} which follows pattern `{<expression>}`
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_TAG = new Set<AST.Tag["type"]>([
	TYPE_CONST_TAG,
	TYPE_DEBUG_TAG,
	TYPE_EXPRESSION_TAG,
	TYPE_HTML_TAG,
	TYPE_RENDER_TAG,
]);
/**
 * Schema of {@link AST.Tag} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const TAG = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_TAG).toArray()),
});
/**
 * Type check guard to see if provided AST node is "tag-like".
 * The ones with pattern `{@<tag-name>}`.
 * Exception is only {@link AST.ExpressionTag} which follows pattern `{<expression>}`
 *
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isTag(input: unknown): input is AST.Tag {
	return v.is(TAG, input);
}
