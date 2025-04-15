/**
 * Printers related to Svelte **HTML**-related AST nodes only.
 * @module svelte-ast-print/template/html
 */

import type { AST as SV } from "svelte/compiler";

import { HTMLComment, type HTMLNode } from "../_internal/html.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printHTMLNode(
	n: HTMLNode,
	opts: Partial<PrintOptions>,
): Result<HTMLNode> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printComment(
	n: SV.Comment,
	opts: Partial<PrintOptions> = {},
): Result<SV.Comment> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printText(
	n: SV.Text,
	opts: Partial<PrintOptions> = {},
): Result<SV.Text> {
	const st = State.get(n, opts);
	st.add(n.raw);
	return st.result;
}
