/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { Result } from "../_internal/shared.js";
 * @import { PrintOptions } from "../_internal/option.js";
 */

/**
 * Printers related to Svelte **CSS**-related AST nodes only.
 * @module svelte-ast-print/css
 */

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import { State } from "../_internal/shared.js";
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
 * @param {SV.CSS.Node} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Node>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSS(n, opts = {}) {
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
 * @param {SV.CSS.Block} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Block>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSBlock(n, opts = {}) {
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
 * @param {SV.CSS.Combinator} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Combinator>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSCombinator(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 *
 * @param {SV.CSS.Declaration} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Declaration>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSDeclaration(n, opts = {}) {
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
 * @param {SV.CSS.SimpleSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.SimpleSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSimpleSelector(n, opts = {}) {
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
 * @param {SV.CSS.AttributeSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.AttributeSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAttributeSelector(n, opts = {}) {
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
 * @param {SV.CSS.ClassSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.ClassSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSClassSelector(n, opts = {}) {
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
 * @param {SV.CSS.IdSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.IdSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSIdSelector(n, opts = {}) {
	const st = State.get(n, opts);
	st.add("#", n.name);
	return st.result;
}

/**
 * @param {SV.CSS.NestingSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.NestingSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNestingSelector(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(n.name);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
 *
 * @param {SV.CSS.PseudoClassSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.PseudoClassSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPseudoClassSelector(n, opts = {}) {
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
 * WARN: It doesn't support args, e.g. `::part()` or  `::slotted()`
 *
 * @param {SV.CSS.PseudoElementSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.PseudoElementSelector>}
 * @__NO_SIDE_EFFECTS__
 *
 */
export function printCSSPseudoElementSelector(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(char.COLON.repeat(2), n.name);
	return st.result;
}

/**
 * @param {SV.CSS.RelativeSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.RelativeSelector>}
 * @__NO_SIDE_EFFECTS__
 *
 */
export function printCSSRelativeSelector(n, opts = {}) {
	const st = State.get(n, opts);
	if (n.combinator) st.add(printCSSCombinator(n.combinator, opts), char.SPACE);
	for (const s of n.selectors) st.add(printCSSSimpleSelector(s, opts));
	return st.result;
}

/**
 * @param {SV.CSS.TypeSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.TypeSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSTypeSelector(n, opts = {}) {
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
 * @param {SV.CSS.Nth} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Nth>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNth(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(char.COLON, "nth-child", new RoundBrackets("inline", n.value));
	return st.result;
}

/**
 * @param {SV.CSS.Percentage} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Percentage>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPercentage(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(n.value);
	return st.result;
}

/**
 * @param {SV.CSS.SelectorList} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.SelectorList>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSelectorList(n, opts = {}) {
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
 * @param {SV.CSS.ComplexSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.ComplexSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSComplexSelector(n, opts = {}) {
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
 * @param {SV.CSS.Atrule} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Atrule>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAtrule(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(char.AT, n.name, char.SPACE, n.prelude);
	if (n.block) st.add(char.SPACE, printCSSBlock(n.block, opts));
	else st.add(char.SEMI);
	return st.result;
}

/**
 * @param {SV.CSS.Rule} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Rule>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRule(n, opts = {}) {
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
 * @param {SV.CSS.StyleSheet} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.StyleSheet>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSStyleSheet(n, opts = {}) {
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
