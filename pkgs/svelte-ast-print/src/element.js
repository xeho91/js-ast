/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { Line, Result, SP } from "./_state.js";
import { printAttributeLike } from "./attribute.js";
import { printFragment } from "./fragment.js";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const NATIVE_SELF_CLOSEABLE = new Set(
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
export const EL = /** @type {const} */ ({
	START: "<",
	END: ">",
	MID: ":",
	CLOSE: "/",
	/**
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof EL.START}${T}`}
	 */
	open: (name) => `${EL.START}${name}`,
	/**
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof EL.START}${typeof EL.CLOSE}${T}${typeof EL.END}`}
	 */
	close: (name) => `${EL.START}${EL.CLOSE}${name}${EL.END}`,
	/**
	 * @return {`${typeof EL.CLOSE}${typeof EL.END}`}
	 */
	self_close: () => `${EL.CLOSE}${EL.END}`,
	/**
	 * @param {SV.ElementLike} n
	 * @return {boolean}
	 */
	is_self_closing: (n) =>
		NATIVE_SELF_CLOSEABLE
			// @ts-expect-error: WARN: `Set.prototype.has()` doesn't accept loose string
			.has(n.name) ||
		// or if there's no "children"
		n.fragment.nodes.length === 0,
	/**
	 * @template {SV.ElementLike} N
	 * @param {N} n
	 * @param {Partial<PrintOptions>} [opts]
	 * @return {Result<N>}
	 */
	print_maybe_self_closing: (n, opts) => {
		const res = new Result(n, opts);
		const self_closing = EL.is_self_closing(n);
		const opening = EL.create_opening(res.create_ln(), n, self_closing);
		if (n.fragment && !self_closing) {
			if (n.fragment.nodes.length === 1) {
				opening.add(
					//
					EL.END,
					printFragment(n.fragment, opts),
					EL.close(n.name),
				);
				res.add_ln(opening);
			} else {
				opening.add(EL.END);
				res.add_ln(opening);
				res.depth++;
				res.add_ln_with_pcs(printFragment(n.fragment, opts));
				res.depth--;
				res.add_ln_with_pcs(EL.close(n.name));
			}
		} else res.add_ln(opening);
		return res;
	},
	prep_attrs: () => {},
	/**
	 * @param {Line} ln
	 * @param {SV.ElementLike} n
	 * @param {boolean} self_closing
	 * @return {Line}
	 */
	create_opening: (ln, n, self_closing) => {
		const attrs = n.attributes.map((a) => printAttributeLike(a));
		ln.add(
			EL.open(n.name),
			attrs.length > 0 && SP,
			n.attributes.map((a) => printAttributeLike(a)),
			self_closing && EL.self_close(),
		);
		return ln;
	},
	/**
	 * @template {SV.ElementLike} N
	 * @param {N} n
	 * @param {Partial<PrintOptions>} [opts]
	 * @return {Result<N>}
	 */
	print_self_closing: (n, opts) => {
		const res = new Result(n, opts);
		res.add_ln(EL.create_opening(res.create_ln(), n, true));
		return res;
	},
	/**
	 * @template {SV.ElementLike} N
	 * @param {N} n
	 * @param {Partial<PrintOptions>} [opts]
	 * @return {Result<N>}
	 */
	print_non_self_closing: (n, opts) => {
		const res = new Result(n, opts);
		const opening = EL.create_opening(res.create_ln(), n, false);
		opening.add(EL.END, printFragment(n.fragment, opts), EL.close(n.name));
		res.add_ln(opening);
		return res;
	},
});

/**
 * @param {SV.ElementLike} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ElementLike>}
 * @__NO_SIDE_EFFECTS__
 */
export function printElementLike(n, opts) {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Component": return printComponent(n, opts);
		case "RegularElement": return printRegularElement(n, opts);
		case "SlotElement": return printSlotElement(n, opts);
		case "SvelteBody": return printSvelteBody(n, opts);
		case "SvelteBoundary":return printSvelteBoundary(n, opts);
		case "SvelteComponent": return printSvelteComponent(n, opts);
		case "SvelteDocument": return printSvelteDocument(n, opts);
		case "SvelteElement": return printSvelteElement(n, opts);
		case "SvelteFragment":return printSvelteFragment(n, opts);
		case "SvelteHead": return printSvelteHead(n, opts);
		case "SvelteOptions": return printSvelteOptions(n, opts);
		case "SvelteSelf": return printSvelteSelf(n, opts);
		case "SvelteWindow": return printSvelteWindow(n, opts);
		case "TitleElement": return printTitleElement(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components}
 *
 * @param {SV.Component} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Component>}
 * @__NO_SIDE_EFFECTS__
 */
export function printComponent(n, opts) {
	return EL.print_maybe_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components}
 *
 * @param {SV.RegularElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.RegularElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printRegularElement(n, opts) {
	return EL.print_maybe_self_closing(n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slot}
 *
 * @param {SV.SlotElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SlotElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSlotElement(n, opts) {
	return EL.print_maybe_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-body}
 *
 * @param {SV.SvelteBody} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteBody>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBody(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-boundary}
 *
 * @param {SV.SvelteBoundary} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteBoundary>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBoundary(n, opts) {
	return EL.print_non_self_closing(n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-component}
 *
 * @param {SV.SvelteComponent} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteComponent>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteComponent(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-document}
 *
 * @param {SV.SvelteDocument} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteDocument>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteDocument(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-element}
 *
 * @param {SV.SvelteElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteElement(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-fragment}
 *
 * @param {SV.SvelteFragment} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteFragment>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteFragment(n, opts) {
	return EL.print_non_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-head}
 *
 * @param {SV.SvelteHead} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteHead>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteHead(n, opts) {
	return EL.print_non_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-options}
 *
 * @param {SV.SvelteOptionsRaw} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteOptionsRaw>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteOptions(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-self}
 *
 * @param {SV.SvelteSelf} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteSelf>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteSelf(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-window}
 *
 * @param {SV.SvelteWindow} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteWindow>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteWindow(n, opts) {
	return EL.print_self_closing(n, opts);
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 *
 * @param {SV.TitleElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.TitleElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTitleElement(n, opts) {
	return EL.print_non_self_closing(n, opts);
}
