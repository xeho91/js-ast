/**
 * Printers related to Svelte **CSS**-related AST nodes only.
 * @module svelte-ast-print/css
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import { CurlyBrackets, DoubleQuotes, RoundBrackets, SquareBrackets } from "../_internal/wrapper.js";
import { printAttributeLike } from "../template/mod.js";

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors}
 *
 * @example syntax
 * ```css
 * [name<?matcher><?"value"> flags?]
 * ```
 *
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

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSBlock(n: SV.CSS.Block, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Block> {
	const st = State.get(n, opts);
	const brackets = new CurlyBrackets("mutliline");
	for (const ch of n.children) {
		switch (ch.type) {
			case "Declaration": {
				brackets.insert(printCSSDeclaration(ch, opts));
				break;
			}
			case "Rule": {
				brackets.insert(printCSSRule(ch, opts));
				break;
			}
			case "Atrule": {
				brackets.insert(printCSSAtrule(ch, opts));
				break;
			}
		}
	}
	// st.break(-1);
	st.add(brackets);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSCombinator(n: SV.CSS.Combinator, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Combinator> {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSDeclaration(
	n: SV.CSS.Declaration,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.Declaration> {
	const st = State.get(n, opts);
	st.add(
		//
		n.property,
		char.COLON,
		char.SPACE,
		n.value.split(/[\n|\t]+/g).join(char.SPACE),
		char.SEMI,
	);
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSimpleSelector(
	n: SV.CSS.SimpleSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.SimpleSelector> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "AttributeSelector": return printCSSAttributeSelector(n, opts);
		case "ClassSelector": return printCSSClassSelector(n, opts);
		case "IdSelector": return printCSSIdSelector(n, opts);
		case "NestingSelector": return printCSSNestingSelector(n, opts);
		case "PseudoClassSelector": return printCSSPseudoClassSelector(n, opts);
		case "PseudoElementSelector": return printCSSPseudoElementSelector(n, opts);
		case "TypeSelector": return printCSSTypeSelector(n, opts);
		case "Nth": return printCSSNth(n, opts);
		case "Percentage": return printCSSPercentage(n, opts);
	}
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors}
 *
 * @example syntax
 * ```css
 * [name<?matcher><?"value"> flags?]
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAttributeSelector(
	n: SV.CSS.AttributeSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.AttributeSelector> {
	const st = State.get(n, opts);
	const brackets = new SquareBrackets(
		"inline",
		//
		n.name,
		n.matcher,
		n.value && new DoubleQuotes("inline", n.value),
		n.flags && [char.SPACE, n.flags],
	);
	st.add(brackets);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors}
 *
 * @example simple
 * ```css
 * .class_name { style properties }
 * ```
 *
 * @example equivalent
 * ```css
 * [class~=class_name] { style properties }
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSClassSelector(
	n: SV.CSS.ClassSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.ClassSelector> {
	const st = State.get(n, opts);
	st.add(".", n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors}
 *
 * @example pattern
 * ```css
 * #name
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSIdSelector(n: SV.CSS.IdSelector, opts: Partial<PrintOptions> = {}): Result<SV.CSS.IdSelector> {
	const st = State.get(n, opts);
	st.add("#", n.name);
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNestingSelector(
	n: SV.CSS.NestingSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.NestingSelector> {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPseudoClassSelector(
	n: SV.CSS.PseudoClassSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.PseudoClassSelector> {
	const st = State.get(n, opts);
	st.add(
		//
		char.COLON,
		n.name,
		n.args && new RoundBrackets("inline", printCSSSelectorList(n.args, opts)),
	);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements}
 *
 * @__NO_SIDE_EFFECTS__
 * WARN: It doesn't support args, e.g. `::part()` or  `::slotted()`
 */
export function printCSSPseudoElementSelector(
	n: SV.CSS.PseudoElementSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.PseudoElementSelector> {
	const st = State.get(n, opts);
	st.add(char.COLON.repeat(2), n.name);
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRelativeSelector(
	n: SV.CSS.RelativeSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.RelativeSelector> {
	const st = State.get(n, opts);
	if (n.combinator) st.add(printCSSCombinator(n.combinator, opts), char.SPACE);
	for (const s of n.selectors) st.add(printCSSSimpleSelector(s, opts));
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSTypeSelector(
	n: SV.CSS.TypeSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.TypeSelector> {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child}
 *
 * @example pattern
 * ```css
 * :nth-child(<nth> [of <complex-selector-list>]?) { }
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNth(n: SV.CSS.Nth, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Nth> {
	const st = State.get(n, opts);
	st.add(char.COLON, "nth-child", new RoundBrackets("inline", n.value));
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPercentage(n: SV.CSS.Percentage, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Percentage> {
	const st = State.get(n, opts);
	st.add(n.value);
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSelectorList(
	n: SV.CSS.SelectorList,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.SelectorList> {
	const st = State.get(n, opts);
	for (const [idx, ch] of n.children.entries()) {
		st.add(
			//
			idx > 0 && char.SPACE,
			printCSSComplexSelector(ch, opts),
		);
	}
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Complex_selectors}
 *
 * @example simple
 * ```css
 * .class_name { style properties }
 * ```
 *
 * @example equivalent
 * ```css
 * [class~=class_name] { style properties }
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSComplexSelector(
	n: SV.CSS.ComplexSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.ComplexSelector> {
	const st = State.get(n, opts);
	for (const [idx, c] of n.children.entries()) {
		st.add(
			//
			printCSSRelativeSelector(c, opts),
			idx !== n.children.length - 1 && char.SPACE,
		);
	}
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAtrule(n: SV.CSS.Atrule, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Atrule> {
	const st = State.get(n, opts);
	st.add(char.AT, n.name, char.SPACE, n.prelude);
	if (n.block) st.add(char.SPACE, printCSSBlock(n.block, opts));
	else st.add(char.SEMI);
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRule(n: SV.CSS.Rule, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Rule> {
	const st = State.get(n, opts);
	st.add(
		//
		printCSSSelectorList(n.prelude, opts),
		char.SPACE,
		printCSSBlock(n.block, opts),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSStyleSheet(n: SV.CSS.StyleSheet, opts: Partial<PrintOptions> = {}): Result<SV.CSS.StyleSheet> {
	const st = State.get(n, opts);
	const name = "style";
	const opening = new HTMLOpeningTag("inline", name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) opening.insert(char.SPACE, printAttributeLike(a));
	}
	st.add(opening);
	st.break(+1);
	for (const [idx, ch] of n.children.entries()) {
		// biome-ignore format: Prettier
		// prettier-ignore
		switch (ch.type) {
			case "Atrule": {
				st.add(printCSSAtrule(ch, opts));
				break;
			}
			case "Rule": {
				st.add(printCSSRule(ch, opts));
				break;
			}
		}
		if (idx < n.children.length - 1) st.break();
	}
	st.break(-1);
	st.add(new HTMLClosingTag("inline", name));
	return st.result;
}
