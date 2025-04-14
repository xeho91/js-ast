/**
 * Related to {@link AST.CSS.Node}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";
import {
	TYPES_CSS_SIMPLE_SELECTOR,
	TYPE_CSS_COMPLEX_SELECTOR,
	TYPE_CSS_RELATIVE_SELECTOR,
	TYPE_CSS_SELECTOR_LIST,
} from "./selector.ts";
import { TYPE_CSS_STYLE_SHEET } from "./style-sheet.ts";

/**
 * Type literal for {@link AST.CSS.Block}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_BLOCK = "Block";
/**
 * Validator for CSS Block nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_BLOCK),
});
/**
 * Type guard for CSS Block nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSBlock(input: unknown): input is AST.CSS.Block {
	return v.is(CSS_BLOCK, input);
}

/**
 * Type literal for CSS Combinator nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_COMBINATOR = "Combinator";
/**
 * Validator for CSS Combinator nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_COMBINATOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_COMBINATOR),
});
/**
 * Type guard for CSS Combinator nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSScombinator(input: unknown): input is AST.CSS.Combinator {
	return v.is(CSS_COMBINATOR, input);
}

/**
 * Type literal for CSS Declaration nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_DECLARATION = "Declaration";
/**
 * Validator for CSS Declaration nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_DECLARATION = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_DECLARATION),
});
/**
 * Type guard for CSS Declaration nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSDeclaration(input: unknown): input is AST.CSS.Declaration {
	return v.is(CSS_DECLARATION, input);
}

/**
 * Type literal for CSS AtRule nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_ATRULE = "Atrule";
/**
 * Validator for CSS AtRule nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_ATRULE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_ATRULE),
});
/**
 * Type guard for CSS AtRule nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSAtrule(input: unknown): input is AST.CSS.Atrule {
	return v.is(CSS_ATRULE, input);
}

/**
 * Type literal for CSS Rule nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_RULE = "Rule";
/**
 * Validator for CSS Rule nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_RULE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_RULE),
});
/**
 * Type guard for CSS Rule nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSRule(input: unknown): input is AST.CSS.Rule {
	return v.is(CSS_RULE, input);
}

/**
 * Set containing all of the AST node types of Svelte syntax related to CSS.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_CSS_NODE = new Set<AST.CSS.Node["type"]>([
	TYPE_CSS_BLOCK,
	TYPE_CSS_DECLARATION,
	TYPE_CSS_RULE,
	TYPE_CSS_ATRULE,
	TYPE_CSS_COMBINATOR,
	TYPE_CSS_COMPLEX_SELECTOR,
	TYPE_CSS_RELATIVE_SELECTOR,
	TYPE_CSS_SELECTOR_LIST,
	TYPE_CSS_STYLE_SHEET,
] as const).union(TYPES_CSS_SIMPLE_SELECTOR);
/**
 * Validator for CSS nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_NODE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_CSS_NODE).toArray()),
});
/**
 * Type check guard to see if provided AST node is a CSS based {@link AST.CSS.Node}.
 * @param input - Supported AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree` specification!
 */
export function isCSSNode(input: unknown): input is AST.CSS.Node {
	return v.is(CSS_NODE, input);
}

export * from "./selector.ts";
export * from "./style-sheet.ts";
