import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.js";

/**
 * Type literal for CSS Attribute Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_ATTRIBUTE_SELECTOR = "AttributeSelector";
/**
 * Validator for CSS Attribute Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_ATTRIBUTE_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_ATTRIBUTE_SELECTOR),
});
/**
 * Type guard for CSS Attribute Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSAttributeSelector(input: unknown): input is AST.CSS.AttributeSelector {
	return v.is(CSS_ATTRIBUTE_SELECTOR, input);
}

/**
 * Type literal for CSS Class Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_CLASS_SELECTOR = "ClassSelector";
/**
 * Validator for CSS Class Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_CLASS_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_CLASS_SELECTOR),
});
/**
 * Type guard for CSS Class Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSClassSelector(input: unknown): input is AST.CSS.ClassSelector {
	return v.is(CSS_CLASS_SELECTOR, input);
}

/**
 * Type literal for CSS ID Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_ID_SELECTOR = "IdSelector";
/**
 * Validator for CSS ID Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_ID_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_ID_SELECTOR),
});
/**
 * Type guard for CSS ID Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSIdSelector(input: unknown): input is AST.CSS.IdSelector {
	return v.is(CSS_ID_SELECTOR, input);
}

/**
 * Type literal for CSS Nesting Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_NESTING_SELECTOR = "NestingSelector";
/**
 * Validator for CSS Nesting Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_NESTING_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_NESTING_SELECTOR),
});
/**
 * Type guard for CSS Nesting Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSNestingSelector(input: unknown): input is AST.CSS.NestingSelector {
	return v.is(CSS_NESTING_SELECTOR, input);
}

/**
 * Type literal for CSS Nth nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_NTH = "Nth";
/**
 * Validator for CSS Nth nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_NTH = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_NTH),
});
/**
 * Type guard for CSS Nth nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSNth(input: unknown): input is AST.CSS.Nth {
	return v.is(CSS_NTH, input);
}

/**
 * Type literal for CSS Percentage nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_PERCENTAGE = "Percentage";
/**
 * Validator for CSS Percentage nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_PERCENTAGE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_PERCENTAGE),
});
/**
 * Type guard for CSS Percentage nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSPercentage(input: unknown): input is AST.CSS.Percentage {
	return v.is(CSS_PERCENTAGE, input);
}

/**
 * Type literal for CSS Pseudo Class Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_PSEUDO_CLASS_SELECTOR = "PseudoClassSelector";
/**
 * Validator for {@link AST.CSS.PseudoClassSelector}
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_PSEUDO_CLASS_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_PSEUDO_CLASS_SELECTOR),
});
/**
 * Type guard for CSS Pseudo Class Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSpseudoClassSelector(input: unknown): input is AST.CSS.PseudoClassSelector {
	return v.is(CSS_PSEUDO_CLASS_SELECTOR, input);
}

/**
 * Type literal for CSS Pseudo Element Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_PSEUDO_ELEMENT_SELECTOR = "PseudoElementSelector";
/**
 * Validator for CSS Pseudo Element Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_PSEUDO_ELEMENT_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_PSEUDO_ELEMENT_SELECTOR),
});
/**
 * Type guard for CSS Pseudo Element Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSpseudoElementSelector(input: unknown): input is AST.CSS.PseudoElementSelector {
	return v.is(CSS_PSEUDO_ELEMENT_SELECTOR, input);
}

/**
 * Type literal for CSS Relative Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_RELATIVE_SELECTOR = "RelativeSelector";
/**
 * Validator for CSS Relative Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_RELATIVE_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_RELATIVE_SELECTOR),
});
/**
 * Type guard for CSS Relative Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSRelativeSelector(input: unknown): input is AST.CSS.RelativeSelector {
	return v.is(CSS_RELATIVE_SELECTOR, input);
}

/**
 * Type literal for CSS Type Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_TYPE_SELECTOR = "TypeSelector";
/**
 * Validator for CSS Type Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_TYPE_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_TYPE_SELECTOR),
});
/**
 * Type guard for CSS Type Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSTypeSelector(input: unknown): input is AST.CSS.TypeSelector {
	return v.is(CSS_TYPE_SELECTOR, input);
}

/**
 * Set containing all of the AST node types for CSS simple Selector.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_CSS_SIMPLE_SELECTOR = new Set<AST.CSS.SimpleSelector["type"]>([
	TYPE_CSS_ATTRIBUTE_SELECTOR,
	TYPE_CSS_CLASS_SELECTOR,
	TYPE_CSS_ID_SELECTOR,
	TYPE_CSS_NESTING_SELECTOR,
	TYPE_CSS_NTH,
	TYPE_CSS_PERCENTAGE,
	TYPE_CSS_PSEUDO_CLASS_SELECTOR,
	TYPE_CSS_PSEUDO_ELEMENT_SELECTOR,
	TYPE_CSS_TYPE_SELECTOR,
] as const);

/**
 * Validator for CSS Simple Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_SIMPLE_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_CSS_SIMPLE_SELECTOR).toArray()),
});

/**
 * Type check guard to see if provided AST node is a CSS based {@link AST.CSS.Node}.
 * @param input - Supported AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree` specification!
 */
export function isCSSSimpleSelector(input: unknown): input is AST.CSS.SimpleSelector {
	return v.is(CSS_SIMPLE_SELECTOR, input);
}

/**
 * Type literal for CSS Complex Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_COMPLEX_SELECTOR = "ComplexSelector";
/**
 * Validator for CSS Complex Selector nodes
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_COMPLEX_SELECTOR = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_COMPLEX_SELECTOR),
});
/**
 * Type guard for CSS Complex Selector nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSComplexSelector(input: unknown): input is AST.CSS.ComplexSelector {
	return v.is(CSS_COMPLEX_SELECTOR, input);
}

/**
 * Type literal for CSS Selector List nodes
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_SELECTOR_LIST = "SelectorList";
/**
 * Validator for {@link AST.CSS.SelectorList}
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_SELECTOR_LIST = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_SELECTOR_LIST),
});
/**
 * Type guard for CSS Selector List nodes
 * @param input - Value to check
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSSelectorList(input: unknown): input is AST.CSS.SelectorList {
	return v.is(CSS_SELECTOR_LIST, input);
}
