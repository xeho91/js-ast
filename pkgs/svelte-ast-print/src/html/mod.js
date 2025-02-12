/**
 * @import { AST as SV } from "svelte/compiler";
 * @import { HTMLNode } from "svelte-ast-build";
 *
 * @import { Result } from "../_internal/shared.js";
 * @import { PrintOptions } from "../_internal/option.js";
 */

/**
 * Printers related to Svelte **HTML**-related AST nodes only.
 * @module svelte-ast-print/html
 */

import { HTMLComment } from "../_internal/html.js";
import { State } from "../_internal/shared.js";

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
export function printComment(n, opts = {}) {
	const st = State.get(n, opts);
	// TODO: Convert it to breakable
	st.add(new HTMLComment("inline", n.data));
	return st.result;
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
export function printText(n, opts = {}) {
	const st = State.get(n, opts);
	st.add(n.raw);
	return st.result;
}
