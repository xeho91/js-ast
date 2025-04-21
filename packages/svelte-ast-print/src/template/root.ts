/**
 * Printers related to Svelte **Root** AST nodes only.
 * @module svelte-ast-print/template/root
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.ts";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.ts";
import { print_js } from "../_internal/js.ts";
import type { PrintOptions } from "../_internal/option.ts";
import { type Result, State } from "../_internal/shared.ts";
import { printCSSAtrule, printCSSRule } from "../css/rule.ts";
import { printFragment } from "../fragment.ts";
import { printAttributeLike } from "./attribute-like.ts";
import { printSvelteOptions } from "./element-like.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printRoot(n: SV.Root, opts: Partial<PrintOptions> = {}): Result<SV.Root> {
	const st = State.get(n, opts);
	let had_previous_node = false;
	const insert_two_line_breaks = () => {
		st.break();
		st.break();
	};
	for (const [idx, curr_name] of st.opts.order.entries()) {
		switch (curr_name) {
			case "options": {
				if (n.options) {
					if (had_previous_node) insert_two_line_breaks();
					st.add(printSvelteOptions(n.options, opts));
				}
				break;
			}
			case "instance": {
				if (n.instance) {
					if (had_previous_node) insert_two_line_breaks();
					st.add(printScript(n.instance, opts));
				}
				break;
			}
			case "module": {
				if (n.module) {
					if (had_previous_node) insert_two_line_breaks();
					st.add(printScript(n.module, opts));
				}
				break;
			}
			case "fragment": {
				if (n.fragment.nodes.length) {
					if (had_previous_node) insert_two_line_breaks();
					st.add(printFragment(n.fragment, opts));
				}
				break;
			}
			case "css": {
				if (n.css) {
					if (had_previous_node) insert_two_line_breaks();
					st.add(printCSSStyleSheet(n.css, opts));
				}
				break;
			}
		}
		if (idx && n[curr_name]) had_previous_node = true;
	}
	return st.result;
}

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printScript(n: SV.Script, opts: Partial<PrintOptions> = {}): Result<SV.Script> {
	const name = "script";
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) opening.insert(char.SPACE, printAttributeLike(a));
	}
	st.add(opening);
	st.break(+1);
	st.add(print_js(n.content, st.opts));
	st.break(-1);
	st.add(new HTMLClosingTag("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSStyleSheet(n: SV.CSS.StyleSheet, opts: Partial<PrintOptions> = {}): Result<SV.CSS.StyleSheet> {
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
