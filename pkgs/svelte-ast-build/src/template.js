/**
 * Related to {@link AST.TemplateNode}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "./_shared.js";

import { TYPES_ATTRIBUTE_LIKE } from "./attribute.js";
import { TYPES_BLOCK } from "./block.js";
import { TYPES_ELEMENT_LIKE } from "./element.js";
import { TYPES_HTML } from "./html.js";
import { TYPE_ROOT } from "./root.js";
import { TYPES_TAG } from "./tag.js";

/**
 * Set containing all of the AST node types of Svelte syntax related to templating.
 * @type {Set<AST.TemplateNode['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_TEMPLATE = new Set(
	/** @type {const} */ ([
		//
		TYPE_ROOT,
	]),
)
	.union(TYPES_ATTRIBUTE_LIKE)
	.union(TYPES_BLOCK)
	.union(TYPES_ELEMENT_LIKE)
	.union(TYPES_HTML)
	.union(TYPES_TAG);

/**
 * Type check guard to see if provided AST node is part of node used for templating {@link AST.TemplateNode}.
 *
 * Those are:
 *
 * - root - what you obtain from the results of from using `parse()` from `"svelte/compiler"`,
 * - text that is included between HTML tags - {@link AST.Text},
 * - HTML comment - {@link AST.Comment}.
 *
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.TemplateNode}
 * @__NO_SIDE_EFFECTS__
 */
export function isTemplate(node) {
	return (
		is_base_node(node) &&
		TYPES_TEMPLATE
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
