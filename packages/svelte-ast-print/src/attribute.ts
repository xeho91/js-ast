/**
 * Printers related to Svelte **attribute**-like related AST nodes only.
 * @module svelte-ast-print/attribute
 */

import type { AST as SV } from "svelte/compiler";
import { isExpressionTag } from "svelte-ast-analyze/template";

import * as char from "./_internal/char.ts";
import { print_js } from "./_internal/js.ts";
import type { PrintOptions } from "./_internal/option.ts";
import { type Result, State } from "./_internal/shared.ts";
import { is_attr_exp_shorthand, print_directive } from "./_internal/template/attribute.ts";
import { CurlyBrackets, DoubleQuotes } from "./_internal/wrapper.ts";
import { printText } from "./html.ts";
import { printExpressionTag } from "./tag.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printAttributeLike(n: SV.AttributeLike, opts: Partial<PrintOptions> = {}): Result<SV.AttributeLike> {
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
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Element-attributes}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printAttribute(n: SV.Attribute, opts: Partial<PrintOptions> = {}): Result<SV.Attribute> {
	const st = State.get(n, opts);
	if (n.value === true) {
		st.add(n.name);
		return st.result;
	}
	if (isExpressionTag(n.value)) {
		if (is_attr_exp_shorthand(n, n.value.expression)) st.add(printExpressionTag(n.value, opts));
		else st.add(n.name, char.ASSIGN, printExpressionTag(n.value, opts));
		return st.result;
	}
	st.add(n.name, char.ASSIGN);
	const quotes = new DoubleQuotes("inline");
	for (const v of n.value) {
		if (isExpressionTag(v)) quotes.insert(printExpressionTag(v, opts));
		else quotes.insert(printText(v, opts));
	}
	st.add(quotes);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Component-props}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSpreadAttribute(
	n: SV.SpreadAttribute,
	opts: Partial<PrintOptions> = {},
): Result<SV.SpreadAttribute> {
	const st = State.get(n, opts);
	st.add(new CurlyBrackets("inline", "...", print_js(n.expression, st.opts)));
	return st.result;
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printAnimateDirective(
	n: SV.AnimateDirective,
	opts: Partial<PrintOptions> = {},
): Result<SV.AnimateDirective> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printBindDirective(n: SV.BindDirective, opts: Partial<PrintOptions> = {}): Result<SV.BindDirective> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printClassDirective(n: SV.ClassDirective, opts: Partial<PrintOptions> = {}): Result<SV.ClassDirective> {
	return print_directive("class", n, opts);
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slots#Passing-data-to-slotted-content}
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printLetDirective(n: SV.LetDirective, opts: Partial<PrintOptions> = {}): Result<SV.LetDirective> {
	return print_directive("let", n, opts);
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-on}
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printOnDirective(n: SV.OnDirective, opts: Partial<PrintOptions> = {}): Result<SV.OnDirective> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printStyleDirective(n: SV.StyleDirective, opts: Partial<PrintOptions> = {}): Result<SV.StyleDirective> {
	const st = State.get(n, opts);
	st.add("style", char.COLON, n.name);
	if (n.modifiers.length > 0) st.add(char.PIPE, n.modifiers.join(char.PIPE));
	if (n.value === true || (isExpressionTag(n.value) && is_attr_exp_shorthand(n, n.value.expression))) {
		return st.result;
	}
	if (isExpressionTag(n.value)) {
		st.add(char.ASSIGN, printExpressionTag(n.value, opts));
		return st.result;
	}
	st.add(char.ASSIGN);
	const quotes = new DoubleQuotes("inline");
	for (const v of n.value) {
		if (isExpressionTag(v)) quotes.insert(printExpressionTag(v, opts));
		else quotes.insert(printText(v, opts));
	}
	st.add(quotes);
	return st.result;
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printTransitionDirective(
	n: SV.TransitionDirective,
	opts: Partial<PrintOptions> = {},
): Result<SV.TransitionDirective> {
	/** @type {"in" | "out" | "transition"} */
	let name: "in" | "out" | "transition";
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printUseDirective(n: SV.UseDirective, opts: Partial<PrintOptions> = {}): Result<SV.UseDirective> {
	return print_directive("use", n, opts);
}
