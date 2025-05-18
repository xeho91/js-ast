/**
 * Printers related to Svelte **tag**-like related AST nodes only.
 * @module svelte-ast-print/template/tag
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import { print_js } from "../_internal/js.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import { CurlyBrackets } from "../_internal/wrapper.js";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printTag(
	n: SV.Tag,
	opts: Partial<PrintOptions> = {},
): Result<SV.Tag> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "AttachTag": return printAttachTag(n, opts);
		case "ConstTag": return printConstTag(n, opts);
		case "DebugTag": return printDebugTag(n, opts);
		case "ExpressionTag": return printExpressionTag(n, opts);
		case "HtmlTag": return printHtmlTag(n, opts);
		case "RenderTag": return printRenderTag(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@attach}
 *
 * @example pattern
 * ```svelte
 * {@attach expression}
 * ```
 *
 * @since 1.1.0
 * @__NO_SIDE_EFFECTS__
 */
export function printAttachTag(
	n: SV.AttachTag,
	opts: Partial<PrintOptions> = {},
): Result<SV.AttachTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			"inline",
			char.AT,
			"attach",
			char.SPACE,
			print_js(n.expression, st.opts, false),
		),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@const}
 *
 * @example pattern
 * ```svelte
 * {@const assignment}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printConstTag(n: SV.ConstTag, opts: Partial<PrintOptions> = {}): Result<SV.ConstTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			"inline",
			char.AT,
			// NOTE: This is an unique case, because we need to remove a semicolon at the end.
			print_js(n.declaration, st.opts).slice(0, -1),
		),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@debug}
 *
 * @example pattern
 * ```svelte
 * {@debug identifiers}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printDebugTag(n: SV.DebugTag, opts: Partial<PrintOptions> = {}): Result<SV.DebugTag> {
	const st = State.get(n, opts);
	const brackets = new CurlyBrackets("inline", char.AT, "debug", char.SPACE);
	for (const [idx, i] of n.identifiers.entries()) {
		if (idx > 0) brackets.insert(char.COMMA, char.SPACE);
		brackets.insert(print_js(i, st.opts));
	}
	st.add(brackets);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Text-expressions}
 *
 * @example pattern
 * ```svelte
 * {expression}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printExpressionTag(n: SV.ExpressionTag, opts: Partial<PrintOptions> = {}): Result<SV.ExpressionTag> {
	const st = State.get(n, opts);
	st.add(new CurlyBrackets("inline", print_js(n.expression, st.opts)));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@html}
 *
 * @example pattern
 * ```svelte
 * {@html expression}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printHtmlTag(n: SV.HtmlTag, opts: Partial<PrintOptions> = {}): Result<SV.HtmlTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			//
			"inline",
			char.AT,
			"html",
			char.SPACE,
			print_js(n.expression, st.opts),
		),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@render}
 *
 * @example pattern
 * ```svelte
 * {@render expression}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printRenderTag(n: SV.RenderTag, opts: Partial<PrintOptions> = {}): Result<SV.RenderTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			//
			"inline",
			char.AT,
			"render",
			char.SPACE,
			print_js(n.expression, st.opts),
		),
	);
	return st.result;
}
