/**
 * @import { AST as SV } from "svelte/compiler";
 * @import { HTMLNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { Result } from "./_state.js";

/**
 * @param {HTMLNode} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<HTMLNode>}
 * @__NO_SIDE_EFFECTS__
 */
export function printHTML(n, opts) {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Comment": return printComment(n, opts);
		case "Text": return printText(n, opts);
	}
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment}
 *
 * @example pattern
 * ```html
 * <!--data-->
 * ```
 *
 * @param {SV.Comment} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Comment>}
 * @__NO_SIDE_EFFECTS__
 */
export function printComment(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs("<!--", n.data, "-->");
	return res;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @example pattern
 * ```html
 * <!--data-->
 * ```
 *
 * @param {SV.Text} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Text>}
 * @__NO_SIDE_EFFECTS__
 */
export function printText(n, opts) {
	const res = new Result(n, opts);
	res.add_ln_with_pcs(n.raw);
	return res;
}
