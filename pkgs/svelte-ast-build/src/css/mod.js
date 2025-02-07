/**
 * Related to {@link AST.CSS.Node}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

import { is_base_node } from "../_shared.js";

import { TYPE_STYLE_SHEET } from "./style-sheet.js";

/**
 * Set containing all of the AST node types of Svelte syntax related to CSS.
 * @type {Set<AST.CSS.Node['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS = new Set([
	TYPE_STYLE_SHEET,
	"Atrule",
	"AttributeSelector",
	"Block",
	"ClassSelector",
	"Combinator",
	"ComplexSelector",
	"Declaration",
	"IdSelector",
	"NestingSelector",
	"Nth",
	"Percentage",
	"PseudoClassSelector",
	"PseudoElementSelector",
	"RelativeSelector",
	"Rule",
	"SelectorList",
	"TypeSelector",
]);

/**
 * Type check guard to see if provided AST node is a CSS based {@link AST.CSS.Node}.
 *
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree` specification!
 *
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.CSS.Node}
 * @__NO_SIDE_EFFECTS__
 */
export function isCSS(node) {
	return (
		is_base_node(node) &&
		TYPE_CSS
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
