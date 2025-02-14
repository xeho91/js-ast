/**
 * Related to {@link HTMLNode}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for HTML Comment node
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_COMMENT = "Comment";
/**
 * Validator for HTML Comment node
 * @__NO_SIDE_EFFECTS__
 */
export const COMMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_COMMENT),
});
/**
 * Type guard for CSS Attribute Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isComment(input: unknown): input is AST.CSS.AttributeSelector {
	return v.is(COMMENT, input);
}

/**
 * Type literal for HTML Text node
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TEXT = "Text";
/**
 * Validator for HTML Text node
 * @__NO_SIDE_EFFECTS__
 */
export const TEXT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_TEXT),
});
/**
 * Type guard for CSS Attribute Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isText(input: unknown): input is AST.CSS.AttributeSelector {
	return v.is(TEXT, input);
}

/**
 * AST nodes related to native HTML.
 */
export type HTMLNode = AST.Comment | AST.Text;

/**
 * Set containing all of the types related to native HTML AST nodes.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_HTML = new Set<HTMLNode["type"]>([
	//
	TYPE_COMMENT,
	TYPE_TEXT,
] as const);
/**
 * @__NO_SIDE_EFFECTS__
 */

export const HTML_NODE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_HTML).toArray()),
});

/**
 * Type check guard to see if provided AST node is a native HTML related.
 *
 * Those are:
 *
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 * @__NO_SIDE_EFFECTS__
 */
export function isHTMLNode(input: unknown): input is HTMLNode {
	return v.is(HTML_NODE, input);
}
