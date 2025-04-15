/**
 * Printers related to Svelte **element**-like related AST nodes only.
 * @module svelte-ast-print/template/element-like
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.ts";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.ts";
import type { PrintOptions } from "../_internal/option.ts";
import { type Result, State } from "../_internal/shared.ts";
import {
	print_maybe_self_closing_el,
	print_non_self_closing_el,
	print_self_closing_el,
} from "../_internal/template/element-like.ts";
import { printFragment } from "../fragment.ts";
import { printAttributeLike } from "./attribute-like.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printElementLike(n: SV.ElementLike, opts: Partial<PrintOptions> = {}): Result<SV.ElementLike> {
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
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printComponent(n: SV.Component, opts: Partial<PrintOptions> = {}): Result<SV.Component> {
	return print_maybe_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printRegularElement(n: SV.RegularElement, opts: Partial<PrintOptions> = {}): Result<SV.RegularElement> {
	return print_maybe_self_closing_el({ n, opts });
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slot}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSlotElement(n: SV.SlotElement, opts: Partial<PrintOptions> = {}): Result<SV.SlotElement> {
	return print_maybe_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-body}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBody(n: SV.SvelteBody, opts: Partial<PrintOptions> = {}): Result<SV.SvelteBody> {
	return print_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-boundary}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBoundary(n: SV.SvelteBoundary, opts: Partial<PrintOptions> = {}): Result<SV.SvelteBoundary> {
	return print_non_self_closing_el({ n, opts });
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-component}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteComponent(
	n: SV.SvelteComponent,
	opts: Partial<PrintOptions> = {},
): Result<SV.SvelteComponent> {
	return print_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-document}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteDocument(n: SV.SvelteDocument, opts: Partial<PrintOptions> = {}): Result<SV.SvelteDocument> {
	return print_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-element}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteElement(n: SV.SvelteElement, opts: Partial<PrintOptions> = {}): Result<SV.SvelteElement> {
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", n.name);
	n.attributes.unshift({
		type: "Attribute",
		name: "this",
		// @ts-expect-error: We ignore `start` and `end`
		value: {
			type: "ExpressionTag",
			expression: n.tag,
		},
	});
	for (const a of n.attributes) opening.insert(char.SPACE, printAttributeLike(a));
	st.add(opening);
	st.add(printFragment(n.fragment, opts));
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-fragment}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteFragment(n: SV.SvelteFragment, opts: Partial<PrintOptions> = {}): Result<SV.SvelteFragment> {
	return print_non_self_closing_el({ n, opts });
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-head}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteHead(n: SV.SvelteHead, opts: Partial<PrintOptions> = {}): Result<SV.SvelteHead> {
	return print_non_self_closing_el({
		n,
		opts,
	});
}

/**
 * TODO: Get rid of this once Svelte maintainers can provide a better solution
 */
type FixedSvelteOptions = SV.SvelteOptionsRaw &
	Omit<SV.SvelteOptions, "attributes" | "start" | "end"> & {
		attributes: SV.SvelteOptions["attributes"];
		options: SV.SvelteOptions;
	};

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-options}
 *
 * @example
 * ```svelte
 * <svelte:options option={value} />
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 * WARN: This one is different, because it can be extracted only from {@link SV.Root}
 */
export function printSvelteOptions(
	n: SV.SvelteOptions | SV.SvelteOptionsRaw | FixedSvelteOptions,
	opts: Partial<PrintOptions> = {},
): Result<FixedSvelteOptions> {
	// @ts-expect-error
	let { attributes, customElement, options, start, end, ...rest } = n;
	if (!attributes) attributes = options.attributes;
	// @ts-expect-error
	return print_self_closing_el({
		// @ts-expect-error
		n: {
			type: "SvelteOptions",
			name: "svelte:options",
			attributes,
			// @ts-expect-error
			start: start || n.options?.start,
			// @ts-expect-error
			end: end || n.options?.end,
			...rest,
		},
		opts,
	});
}

/**
 * @deprecated Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-self}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteSelf(n: SV.SvelteSelf, opts: Partial<PrintOptions> = {}): Result<SV.SvelteSelf> {
	return print_self_closing_el({
		n,
		opts,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-window}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteWindow(n: SV.SvelteWindow, opts: Partial<PrintOptions> = {}): Result<SV.SvelteWindow> {
	return print_self_closing_el({
		n,
		opts,
	});
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printTitleElement(n: SV.TitleElement, opts: Partial<PrintOptions> = {}): Result<SV.TitleElement> {
	return print_non_self_closing_el({
		n,
		opts,
	});
}
