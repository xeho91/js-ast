/**
 * Related to {@link AST.TemplateNode}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";
import { TYPES_HTML } from "../html/mod.ts";
import { TYPES_ATTRIBUTE_LIKE } from "./attribute.ts";
import { TYPES_BLOCK } from "./block.ts";
import { TYPES_ELEMENT_LIKE } from "./element.ts";
import { TYPE_ROOT } from "./root.ts";
import { TYPES_TAG } from "./tag.ts";

/**
 * Set containing all of the AST node types of Svelte syntax related to {@link AST.TemplateNode}.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_TEMPLATE_NODE = new Set<AST.TemplateNode["type"]>([
	//
	TYPE_ROOT,
])
	.union(TYPES_ATTRIBUTE_LIKE)
	.union(TYPES_BLOCK)
	.union(TYPES_ELEMENT_LIKE)
	.union(TYPES_HTML)
	.union(TYPES_TAG);
/**
 * Schema of {@link AST.Fragment} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const TEMPLATE_NODE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_TEMPLATE_NODE).toArray()),
});

/**
 * Type check guard to see if provided AST node is part of node used for templating {@link AST.TemplateNode}.
 *
 * Those are:
 *
 * - root - what you obtain from the results of from using `parse()` from `"svelte/compiler"`,
 * - text that is included between HTML tags - {@link AST.Text},
 * - HTML comment - {@link AST.Comment}.
 *
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isTemplateNode(input: unknown): input is AST.TemplateNode {
	return v.is(TEMPLATE_NODE, input);
}

export * from "./attribute.ts";
export * from "./block.ts";
export * from "./element.ts";
export * from "./fragment.ts";
export * from "./options.ts";
export * from "./root.ts";
export * from "./tag.ts";
