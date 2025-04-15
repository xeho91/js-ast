/**
 * Printers related to Svelte **Root** AST nodes only.
 * @module svelte-ast-print/template/root
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.ts";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.ts";
import { print_js } from "../_internal/js.ts";
import type { PrintOptions } from "../_internal/option.ts";
import { hub, type Result, State } from "../_internal/shared.ts";
import { printCSSAtrule, printCSSRule } from "../css/rule.ts";
import { printAttributeLike } from "./attribute-like.ts";
import { printSvelteOptions } from "./element-like.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printRoot(n: SV.Root, opts: Partial<PrintOptions> = {}): Result<SV.Root> {
	const st = State.get(n, opts);
	for (const [idx, curr_name] of st.opts.order.entries()) {
		switch (curr_name) {
			case "options": {
				if (n.options) st.add(printSvelteOptions(n.options, opts));
				break;
			}
			case "instance": {
				if (n.instance) st.add(printScript(n.instance, opts));
				break;
			}
			case "module": {
				if (n.module) st.add(printScript(n.module, opts));
				break;
			}
			case "fragment": {
				st.add(hub.printFragment(n.fragment, opts));
				break;
			}
			case "css": {
				if (n.css) st.add(printCSSStyleSheet(n.css, opts));
				break;
			}
		}
		const is_last = st.opts.order.at(-1) === curr_name;
		const prev_name = st.opts.order[idx - 1];
		const next_name = st.opts.order[idx + 1];
		// NOTE: This adds line break (x2) between each part of the root
		if (!is_last && (n[curr_name] || (prev_name && n[prev_name])) && next_name && n[next_name]) {
			st.break();
			st.break();
		}
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
