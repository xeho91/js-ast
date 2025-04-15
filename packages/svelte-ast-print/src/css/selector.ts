/**
 * Printers related to CSS **selector** related AST nodes only.
 * @module svelte-ast-print/css/selector
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import {
	DoubleQuotes,
	RoundBrackets,
	SquareBrackets,
} from "../_internal/wrapper.js";

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSCombinator(
	n: SV.CSS.Combinator,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.Combinator> {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @since 1.0.0
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
 * @since 1.0.0
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
 * @since 1.0.0
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSIdSelector(
	n: SV.CSS.IdSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.IdSelector> {
	const st = State.get(n, opts);
	st.add("#", n.name);
	return st.result;
}

/**
 * @since 1.0.0
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
 * @since 1.0.0
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
		n.args &&
			new RoundBrackets("inline", printCSSSelectorList(n.args, opts)),
	);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements}
 *
 * @since 1.0.0
 *
 * @__NO_SIDE_EFFECTS__
 *
 * > [!WARNING]
 * > It doesn't support args, e.g. `::part()` or  `::slotted()`
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRelativeSelector(
	n: SV.CSS.RelativeSelector,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.RelativeSelector> {
	const st = State.get(n, opts);
	if (n.combinator)
		st.add(printCSSCombinator(n.combinator, opts), char.SPACE);
	for (const s of n.selectors) st.add(printCSSSimpleSelector(s, opts));
	return st.result;
}

/**
 * @since 1.0.0
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNth(
	n: SV.CSS.Nth,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.Nth> {
	const st = State.get(n, opts);
	st.add(char.COLON, "nth-child", new RoundBrackets("inline", n.value));
	return st.result;
}

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPercentage(
	n: SV.CSS.Percentage,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.Percentage> {
	const st = State.get(n, opts);
	st.add(n.value);
	return st.result;
}

/**
 * @since 1.0.0
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
 * @since 1.0.0
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
