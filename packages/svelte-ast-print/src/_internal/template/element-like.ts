import type { AST as SV } from "svelte/compiler";

import { printFragment } from "../../fragment.ts";
import { printAttributeLike } from "../../template/attribute-like.ts";
import { printAttachTag } from "../../template/tag.ts";
import * as char from "../char.ts";
import { has_frag_text_or_exp_tag_only } from "../fragment.ts";
import { HTMLClosingTag, HTMLOpeningTag, HTMLSelfClosingTag } from "../html.ts";
import type { PrintOptions } from "../option.ts";
import { type Result, State, Wrapper } from "../shared.ts";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const NATIVE_SELF_CLOSEABLE_ELS = new Set([
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
] as const);

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const NATIVE_INLINE_ELS = new Set([
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
] as const);

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
function is_el_self_closing(n: SV.ElementLike): boolean {
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
 * @__NO_SIDE_EFFECTS__
 */
export function print_maybe_self_closing_el<N extends SV.ElementLike>(params: {
	n: N;
	opts: Partial<PrintOptions>;
}): Result<N> {
	const { n, opts } = params;
	const st = State.get(n, opts);
	const self_closing = is_el_self_closing(n);
	if (self_closing) {
		const tag = new HTMLSelfClosingTag(
			//
			"inline",
			n.name,
		);
		if (n.attributes.length > 0) {
			print_element_like_attributes({
				attributes: n.attributes,
				opts,
				tag,
			});
		}
		tag.insert(char.SPACE);
		st.add(tag);
		return st.result;
	}
	const opening = new HTMLOpeningTag("inline", n.name);
	if (n.attributes.length > 0) {
		print_element_like_attributes({
			attributes: n.attributes,
			opts,
			tag: opening,
		});
	}
	st.add(opening);
	const should_break =
		// @ts-expect-error `Set.prototype.has()` doesn't accept loose string
		!NATIVE_INLINE_ELS.has(n.name) && !has_frag_text_or_exp_tag_only(n.fragment.nodes);
	if (should_break) st.break(+1);
	if (n.fragment) st.add(printFragment(n.fragment, opts));
	if (should_break) st.break(-1);
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export function print_self_closing_el<N extends SV.ElementLike>(params: {
	n: N;
	opts: Partial<PrintOptions>;
}): Result<N> {
	const { n, opts } = params;
	const st = State.get(params.n, opts);
	const tag = new HTMLSelfClosingTag("inline", n.name);
	if (n.attributes.length > 0) {
		print_element_like_attributes({
			attributes: n.attributes,
			opts,
			tag,
		});
	}
	tag.insert(char.SPACE);
	st.add(tag);
	return st.result;
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export function print_non_self_closing_el<N extends SV.ElementLike>(params: {
	n: N;
	opts: Partial<PrintOptions>;
}): Result<N> {
	const { n, opts } = params;
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", n.name);
	if (n.attributes.length > 0) {
		print_element_like_attributes({
			attributes: n.attributes,
			opts,
			tag: opening,
		});
	}
	st.add(opening);
	const should_break =
		// @ts-expect-error `Set.prototype.has()` doesn't accept loose string
		!NATIVE_INLINE_ELS.has(n.name) && !has_frag_text_or_exp_tag_only(n.fragment.nodes);
	if (should_break) st.break(+1);
	st.add(printFragment(n.fragment, opts));
	if (should_break) st.break(-1);
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}

export function isElementLike(n: SV.BaseNode): n is SV.ElementLike {
	return new Set([
		"Component",
		"TitleElement",
		"SlotElement",
		"RegularElement",
		"SvelteBody",
		"SvelteBoundary",
		"SvelteComponent",
		"SvelteDocument",
		"SvelteElement",
		"SvelteFragment",
		"SvelteHead",
		"SvelteOptionsRaw",
		"SvelteSelf",
		"SvelteWindow",
		"SvelteBoundary",
	]).has(n.type);
}

function print_element_like_attributes({
	attributes,
	tag,
	opts,
}: {
	attributes: SV.ElementLike["attributes"];
	tag: Wrapper;
	opts: Partial<PrintOptions>;
}) {
	for (const a of attributes) {
		if (a.type === "AttachTag") {
			tag.insert(char.SPACE, printAttachTag(a, opts));
		} else {
			tag.insert(char.SPACE, printAttributeLike(a, opts));
		}
	}
}
