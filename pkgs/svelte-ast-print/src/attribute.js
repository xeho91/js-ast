/**
 * @import * as JS from "estree";
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { print as print_js } from "esrap";
import { isExpressionTag } from "svelte-ast-build";

import { Result } from "./_state.js";
import { printText } from "./html.js";
import { printExpressionTag } from "./tag.js";

/**
 * @param {SV.AttributeLike} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AttributeLike>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAttributeLike(n, opts) {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch(n.type) {
		case "Attribute": return printAttribute(n, opts);
		case "SpreadAttribute":return printSpreadAttribute(n, opts);
		case "AnimateDirective": return printAnimateDirective(n, opts);
		case "BindDirective": return printBindDirective(n, opts);
		case "ClassDirective": return printClassDirective(n, opts);
		case "LetDirective": return printLetDirective(n, opts);
		case "OnDirective": return printOnDirective(n, opts);
		case "StyleDirective": return printStyleDirective(n, opts);
		case "TransitionDirective": return printTransitionDirective(n, opts);
		case "UseDirective": return printUseDirective(n, opts);
	}
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const EXP = /** @type {const} */ ({
	START: "{",
	END: "}",
	ASSIGN: "=",
	/**
	 * @param {Exclude<SV.AttributeLike, SV.SpreadAttribute>} n
	 * @param {JS.Expression} exp
	 * @returns {boolean}
	 */
	is_shorthand: (n, exp) => exp.type === "Identifier" && exp.name === n.name,
});

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const DIR = /** @type {const} */ ({
	SEP: ":",
	MOD: "|",
});

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Element-attributes}
 *
 * @param {SV.Attribute} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Attribute>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAttribute(n, opts) {
	const res = new Result(n, opts);
	if (n.value === true) {
		res.add_ln_with_pcs(n.name);
		return res;
	}
	if (isExpressionTag(n.value)) {
		if (EXP.is_shorthand(n, n.value.expression)) res.add_ln_with_pcs(printExpressionTag(n.value, opts));
		else res.add_ln_with_pcs(n.name, EXP.ASSIGN, printExpressionTag(n.value, opts));
		return res;
	}
	const ln = res.create_ln(n.name, EXP.ASSIGN, '"');
	for (const v of n.value) {
		if (isExpressionTag(v)) ln.add(printExpressionTag(v, opts));
		else ln.add(printText(v, opts));
	}
	ln.add('"');
	res.add_ln(ln);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Component-props}
 *
 * @param {SV.SpreadAttribute} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SpreadAttribute>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSpreadAttribute(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(EXP.START, "...", print_js(n.expression).code, EXP.END);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/animate}
 *
 * @example with expression
 * ```svelte
 * animate:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * animate:name
 * ```
 *
 * @param {SV.AnimateDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AnimateDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAnimateDirective(n, opts) {
	return print_directive("animate", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/bind}
 *
 * @example with expression
 * ```svelte
 * bind:name={variable}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * bind:name
 * ```
 *
 * @param {SV.BindDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.BindDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printBindDirective(n, opts) {
	return print_directive("bind", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/class}
 *
 * @example with expression
 * ```svelte
 * class:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * class:name
 * ```
 *
 * @param {SV.ClassDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ClassDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printClassDirective(n, opts) {
	return print_directive("class", n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slots#Passing-data-to-slotted-content}
 *
 * @example with expression
 * ```svelte
 * let:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * let:name
 * ```
 *
 * @param {SV.LetDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.LetDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printLetDirective(n, opts) {
	return print_directive("let", n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-on}
 *
 * @example without modifiers
 * ```svelte
 * on:name={expression}
 * ```
 *
 * @example with modifiers
 * ```svelte
 * on:name|modifiers={handler}
 * ```
 *
 * @param {SV.OnDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.OnDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printOnDirective(n, opts) {
	return print_directive("on", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/style}
 *
 * @example with expression tag
 * ```svelte
 * style:name={value}
 * ```
 *
 * @example with text expression
 * ```svelte
 * style:name="text"
 * ```
 *
 * @example without expression
 * ```svelte
 * style:name
 * ```
 *
 * @example with modifiers
 * ```svelte
 * style:name|modifiers="text"
 * ```
 *
 * @param {SV.StyleDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.StyleDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printStyleDirective(n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln("style", DIR.SEP, n.name);
	if (n.modifiers.length > 0) ln.add("|", n.modifiers.join("|"));
	if (n.value === true || (isExpressionTag(n.value) && EXP.is_shorthand(n, n.value.expression))) {
		res.add_ln(ln);
		return res;
	}
	if (isExpressionTag(n.value)) {
		ln.add(EXP.ASSIGN, printExpressionTag(n.value, opts));
		res.add_ln(ln);
		return res;
	}
	ln.add(EXP.ASSIGN, '"');
	for (const v of n.value) {
		if (isExpressionTag(v)) ln.add(printExpressionTag(v, opts));
		else ln.add(printText(v, opts));
	}
	ln.add('"');
	res.add_ln(ln);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/transition}
 * @see {@link https://svelte.dev/docs/svelte/in-and-out}
 *
 * @example without expression
 * ```svelte
 * transition|in|out:name
 * ```
 *
 * @example with expression
 * ```svelte
 * transition|in|out:name={expression}
 * ```
 *
 * @example with global modifier and without expression
 * ```svelte
 * transition|in|out:name|global
 * ```
 *
 * @example with global modifier and with expression
 * ```svelte
 * transition|in|out:name|global={expression}
 * ```
 *
 * @example with local modifier and without expression
 * ```svelte
 * transition|in|out:name|local
 * ```
 *
 * @example with local modifier and with expression
 * ```svelte
 * transition|in|out:name|local={expression}
 * ```
 *
 * @param {SV.TransitionDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.TransitionDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTransitionDirective(n, opts) {
	/** @type {"in" | "out" | "transition"} */
	let name;
	if (n.intro && !n.outro) name = "in";
	else if (!n.intro && n.outro) name = "out";
	else name = "transition";
	return print_directive(name, n, opts);
}

/**
 * @example with expression
 * ```svelte
 * use:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * use:name
 * ```
 * @see {@link https://svelte.dev/docs/svelte/use}
 *
 * @param {SV.UseDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.UseDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printUseDirective(n, opts) {
	return print_directive("use", n, opts);
}

/**
 * @internal
 * Abstraction for printing shared schema in directives
 *
 * @template {Exclude<SV.Directive, SV.StyleDirective>} N
 * @param {string} name
 * @param {N} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<N>}
 * @__NO_SIDE_EFFECTS__
 */
function print_directive(name, n, opts) {
	const res = new Result(n, opts);
	const ln = res.create_ln(name, DIR.SEP, n.name);
	if ("modifiers" in n && n.modifiers.length > 0) ln.add(DIR.MOD, n.modifiers.join(DIR.MOD));
	if (n.expression && !EXP.is_shorthand(n, n.expression)) {
		ln.add(EXP.ASSIGN, EXP.START, print_js(n.expression).code, EXP.END);
	}
	res.add_ln(ln);
	return res;
}
