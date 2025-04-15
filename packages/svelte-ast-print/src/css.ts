/**
 * Printers related to Svelte **CSS**-related AST nodes only.
 * @module svelte-ast-print/css
 */

import type { AST as SV } from "svelte/compiler";

import type { PrintOptions } from "./_internal/option.ts";
import type { Result } from "./_internal/shared.ts";
import { printCSSAtrule, printCSSBlock, printCSSDeclaration, printCSSRule } from "./css/rule.ts";
import {
	printCSSAttributeSelector,
	printCSSClassSelector,
	printCSSCombinator,
	printCSSComplexSelector,
	printCSSIdSelector,
	printCSSNestingSelector,
	printCSSNth,
	printCSSPercentage,
	printCSSPseudoClassSelector,
	printCSSPseudoElementSelector,
	printCSSRelativeSelector,
	printCSSSelectorList,
	printCSSTypeSelector,
} from "./css/selector.ts";
import { printCSSStyleSheet } from "./template/root.ts";

export * from "./css/rule.ts";
export * from "./css/selector.ts";

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors}
 *
 * @example syntax
 * ```css
 * [name<?matcher><?"value"> flags?]
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNode(n: SV.CSS.Node, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Node> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Block": return printCSSBlock(n, opts);
		case "Combinator": return printCSSCombinator(n, opts);
		case "Declaration": return printCSSDeclaration(n, opts);
		case "AttributeSelector": return printCSSAttributeSelector(n, opts);
		case "ClassSelector": return printCSSClassSelector(n, opts);
		case "ComplexSelector": return printCSSComplexSelector(n, opts);
		case "IdSelector": return printCSSIdSelector(n, opts);
		case "NestingSelector": return printCSSNestingSelector(n, opts);
		case "PseudoClassSelector": return printCSSPseudoClassSelector(n, opts);
		case "PseudoElementSelector": return printCSSPseudoElementSelector(n, opts);
		case "RelativeSelector": return printCSSRelativeSelector(n, opts);
		case "TypeSelector": return printCSSTypeSelector(n, opts);
		case "SelectorList": return printCSSSelectorList(n, opts);
		case "Nth": return printCSSNth(n, opts);
		case "Percentage": return printCSSPercentage(n, opts);
		case "Atrule": return printCSSAtrule(n, opts);
		case "Rule": return printCSSRule(n, opts);
		case "StyleSheet": return printCSSStyleSheet(n, opts);
	}
}
