/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "../_option.js";
 */

import { Result, SP } from "../_result.js";
import { printAttributeLike } from "../attribute.js";
import { EL } from "../element.js";

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
export function printCSS(n, opts) {
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
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const BLOCK = /** @type {const} */ ({
	START: "{",
	END: "}",
});

/**
 * @param {SV.CSS.Block} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Block>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSBlock(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(BLOCK.START);
	res.depth++;
	for (const c of n.children) {
		// biome-ignore format: Prettier
		// prettier-ignore
		switch(c.type) {
			case "Declaration": {
				res.depth++;
				res.add_ln_with_pcs(printCSSDeclaration(c, opts));
				res.depth--;
				break;
			}
			case "Rule": res.add_ln_with_pcs(printCSSRule(c, opts)); break;
			case "Atrule": res.add_ln_with_pcs(printCSSAtrule(c, opts)); break;
		}
	}
	res.depth--;
	res.add_ln_with_pcs(BLOCK.END);
	return res;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
 * @param {SV.CSS.Combinator} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Combinator>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSCombinator(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.name);
	return res;
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const DECL = /** @type {const} */ ({
	SEP: ":",
	END: ";",
});

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 *
 * @param {SV.CSS.Declaration} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Declaration>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSDeclaration(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.property, DECL.SEP, SP, n.value, DECL.END);
	return res;
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
export function printCSSAttributeSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		//
		"[",
		n.name,
		n.matcher,
		n.value && `"${n.value}"`,
		n.flags && [SP, n.flags],
		"]",
	);
	return res;
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
export function printCSSClassSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(".", n.name);
	return res;
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
export function printCSSComplexSelector(n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln();
	for (const [idx, c] of n.children.entries()) {
		ln.add(printCSSRelativeSelector(c, opts), idx !== n.children.length - 1 && SP);
	}
	res.add_ln(ln);
	return res;
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
export function printCSSIdSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs("#", n.name);
	return res;
}

/**
 * @param {SV.CSS.NestingSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.NestingSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSNestingSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.name);
	return res;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
 *
 * @param {SV.CSS.PseudoClassSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.PseudoClassSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPseudoClassSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		//
		":",
		n.name,
		n.args && ["(", printCSSSelectorList(n.args, opts), ")"],
	);
	return res;
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
export function printCSSPseudoElementSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(`::${n.name}`);
	return res;
}

/**
 * @param {SV.CSS.RelativeSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.RelativeSelector>}
 * @__NO_SIDE_EFFECTS__
 *
 */
export function printCSSRelativeSelector(n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln(n.combinator && [printCSSCombinator(n.combinator, opts), SP]);
	for (const s of n.selectors) ln.add(printCSSSimpleSelector(s, opts));
	res.add_ln(ln);
	return res;
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const SEL = /** @type {const} */ ({
	AT: "@",
	PREFIX: ":",
	/**
	 * Wraps CSS selector function args in parentheses.
	 * @template {string} N
	 * @template {string} A
	 * @param {N} name
	 * @param {A} a
	 * @returns {`${typeof SEL.PREFIX}${N}(${A})`}
	 */
	fn: (name, a) => `${SEL.PREFIX}${name}(${a})`,
});

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
export function printCSSNth(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(SEL.fn("nth-child", n.value));
	return res;
}

/**
 * @param {SV.CSS.Percentage} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Percentage>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSPercentage(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.value);
	return res;
}

/**
 * @param {SV.CSS.TypeSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.TypeSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSTypeSelector(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.name);
	return res;
}

/**
 * @param {SV.CSS.SimpleSelector} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.SimpleSelector>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSimpleSelector(n, opts) {
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
 * @param {SV.CSS.SelectorList} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.SelectorList>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSSelectorList(n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln();
	for (const c of n.children) ln.add(printCSSComplexSelector(c, opts));
	res.add_ln(ln);
	return res;
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const RULE = /** @type {const} */ ({
	AT: "@",
	END: ";",
});

/**
 * @param {SV.CSS.Atrule} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Atrule>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAtrule(n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln("@", n.name, SP, n.prelude);
	if (n.block) {
		res.depth++;
		ln.add(SP, printCSSBlock(n.block, opts));
		res.depth--;
	} else {
		ln.add(RULE.END);
	}
	res.add_ln(ln);
	return res;
}

/**
 * @param {SV.CSS.Rule} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.Rule>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRule(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(printCSSSelectorList(n.prelude, opts), SP, printCSSBlock(n.block, opts));
	return res;
}
/**
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 *
 * @param {SV.CSS.StyleSheet} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.CSS.StyleSheet>}
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSStyleSheet(n, opts) {
	const name = "style";
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		EL.open(name),
		n.attributes.length > 0 && SP,
		n.attributes.map((a) => printAttributeLike(a).toString()).join(SP),
		EL.END,
	);
	res.depth++;
	n.children;
	for (const c of n.children) {
		// biome-ignore format: Prettier
		// prettier-ignore
		switch (c.type) {
			case "Atrule": res.add_ln_with_pcs(printCSSAtrule(c, opts)); break;
			case "Rule": res.add_ln_with_pcs(printCSSRule(c, opts)); break;
		}
	}
	res.depth--;
	res.add_ln_with_pcs(EL.close(name));
	return res;
}
