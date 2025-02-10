/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { print as print_js } from "esrap";

import { Result, SP } from "./_state.js";

/**
 * @param {SV.Tag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Tag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTag(n, opts) {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "ConstTag": return printConstTag(n, opts);
		case "DebugTag": return printDebugTag(n, opts);
		case "ExpressionTag": return printExpressionTag(n, opts);
		case "HtmlTag": return printHtmlTag(n, opts);
		case "RenderTag": return printRenderTag(n, opts);
	}
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const TAG = /** @type {const} */ ({
	START: "{",
	END: "}",
	OPEN: "@",
	/**
	 * @internal
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof TAG.START}${typeof TAG.OPEN}${T}`}
	 */
	open: (name) => `${TAG.START}${TAG.OPEN}${name}`,
});

/**
 * @see {@link https://svelte.dev/docs/svelte/@const}
 *
 * @example pattern
 * ```svelte
 * {@const assignment}
 * ```
 *
 * @param {SV.ConstTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ConstTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printConstTag(n, opts) {
	const res = new Result(n, opts);
	// // NOTE: This is an unique case, because we need to remove a semicolon at the end.
	res.add_ln_with_pcs(
		//
		TAG.START,
		TAG.OPEN,
		print_js(n.declaration).code.slice(0, -1),
		TAG.END,
	);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@debug}
 *
 * @example pattern
 * ```svelte
 * {@debug identifiers}
 * ```
 *
 * @param {SV.DebugTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.DebugTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printDebugTag(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		//
		TAG.open("debug"),
		SP,
		n.identifiers.map((i) => print_js(i).code).join(`,${SP}`),
		TAG.END,
	);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Text-expressions}
 *
 * @example pattern
 * ```svelte
 * {expression}
 * ```
 *
 * @param {SV.ExpressionTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ExpressionTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printExpressionTag(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(TAG.START, print_js(n.expression).code, TAG.END);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@html}
 *
 * @example pattern
 * ```svelte
 * {@html expression}
 * ```
 *
 * @param {SV.HtmlTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.HtmlTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printHtmlTag(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		//
		TAG.open("html"),
		SP,
		print_js(n.expression).code,
		TAG.END,
	);
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@render}
 *
 * @example pattern
 * ```svelte
 * {@render expression}
 * ```
 *
 * @param {SV.RenderTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.RenderTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printRenderTag(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		//
		TAG.open("render"),
		SP,
		print_js(n.expression).code,
		TAG.END,
	);
	return res;
}
