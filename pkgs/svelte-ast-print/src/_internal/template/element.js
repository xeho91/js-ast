/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { Result } from "../../_internal/shared.js";
 * @import { PrintOptions } from "../option.js";
 * @import { printAttributeLike, printFragment } from "../../template/mod.js";
 */

import { State } from "../../_internal/shared.js";
import * as char from "../char.js";
import { HTMLClosingTag, HTMLOpeningTag, HTMLSelfClosingTag } from "../html.js";
import { has_frag_text_or_exp_tag_only } from "./fragment.js";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const NATIVE_SELF_CLOSEABLE_ELS = new Set(
	/** @type {const} */ ([
		// Native
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr",
	]),
);

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const NATIVE_INLINE_ELS = new Set(
	/** @type {const} */ ([
		"a",
		"abbr",
		"b",
		"bdo",
		"bdi",
		"br",
		"cite",
		"code",
		"data",
		"dfn",
		"em",
		"i",
		"kbd",
		"mark",
		"q",
		"rp",
		"rt",
		"ruby",
		"s",
		"samp",
		"small",
		"span",
		"strong",
		"sub",
		"sup",
		"time",
		"u",
		"var",
		"wbr",
		"button",
		"input",
		"label",
		"select",
		"textarea",
	]),
);

/**
 * @internal
 * @param {SV.ElementLike} n
 * @return {boolean}
 * @__NO_SIDE_EFFECTS__
 */
function is_el_self_closing(n) {
	return (
		NATIVE_SELF_CLOSEABLE_ELS
			// @ts-expect-error: WARN: `Set.prototype.has()` doesn't accept loose string
			.has(n.name) ||
		// or if there's no "children"
		n.fragment.nodes.length === 0
	);
}

/**
 * @internal
 * @template {SV.ElementLike} N
 * @param {object} params
 * @param {N} params.n
 * @param {Partial<PrintOptions>} params.opts
 * @param {typeof printAttributeLike} params.attr_printer
 * @param {typeof printFragment} params.frag_printer
 * @return {Result<N>}
 * @__NO_SIDE_EFFECTS__
 */
export function print_maybe_self_closing_el(params) {
	const { n, opts, attr_printer, frag_printer } = params;
	const st = State.get(n, opts);
	const self_closing = is_el_self_closing(n);
	if (self_closing) {
		const tag = new HTMLSelfClosingTag(
			//
			"inline",
			n.name,
		);
		if (n.attributes.length > 0) {
			for (const a of n.attributes) tag.insert(char.SPACE, attr_printer(a));
		}
		tag.insert(char.SPACE);
		st.add(tag);
		return st.result;
	}
	const opening = new HTMLOpeningTag("inline", n.name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) opening.insert(char.SPACE, attr_printer(a));
	}
	st.add(opening);
	const should_break =
		// @ts-expect-error `Set.prototype.has()` doesn't accept loose string
		!NATIVE_INLINE_ELS.has(n.name) && !has_frag_text_or_exp_tag_only(n.fragment.nodes);
	if (should_break) st.break(+1);
	if (n.fragment) st.add(frag_printer(n.fragment, opts));
	if (should_break) st.break(-1);
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}

/**
 * @internal
 * @template {SV.ElementLike} N
 * @param {object} params
 * @param {N} params.n
 * @param {Partial<PrintOptions>} params.opts
 * @param {typeof printAttributeLike} params.attr_printer
 * @return {Result<N>}
 * @__NO_SIDE_EFFECTS__
 */
export function print_self_closing_el(params) {
	const { n, opts, attr_printer } = params;
	const st = State.get(params.n, opts);
	const tag = new HTMLSelfClosingTag("inline", n.name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) tag.insert(char.SPACE, attr_printer(a, opts));
	}
	tag.insert(char.SPACE);
	st.add(tag);
	return st.result;
}

/**
 * @internal
 * @template {SV.ElementLike} N
 * @param {object} params
 * @param {N} params.n
 * @param {Partial<PrintOptions>} params.opts
 * @param {typeof printAttributeLike} params.attr_printer
 * @param {typeof printFragment} params.frag_printer
 * @return {Result<N>}
 */
export function print_non_self_closing_el(params) {
	const { n, opts, attr_printer, frag_printer } = params;
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", n.name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) opening.insert(char.SPACE, attr_printer(a));
	}
	st.add(opening);
	const should_break =
		// @ts-expect-error `Set.prototype.has()` doesn't accept loose string
		!NATIVE_INLINE_ELS.has(n.name) && !has_frag_text_or_exp_tag_only(n.fragment.nodes);
	if (should_break) st.break(+1);
	st.add(frag_printer(n.fragment, opts));
	if (should_break) st.break(-1);
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}
