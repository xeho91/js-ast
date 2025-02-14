/**
 * Related to {@link AST.ElementLike}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";
import { TYPE_SVELTE_OPTIONS } from "./options.ts";

/**
 * Type literal for {@link AST.Component}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_COMPONENT = "Component";
/**
 * Schema of {@link AST.Component} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const COMPONENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_COMPONENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isComponent(input: unknown): input is AST.Component {
	return v.is(COMPONENT, input);
}

/**
 * Type literal for {@link AST.RegularElement}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_REGULAR_ELEMENT = "RegularElement";
/**
 * Schema of {@link AST.RegularElement} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const REGULAR_ELEMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_REGULAR_ELEMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isRegularElement(input: unknown): input is AST.RegularElement {
	return v.is(REGULAR_ELEMENT, input);
}

/**
 * Type literal for {@link AST.SlotElement}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SLOT_ELEMENT = "SlotElement";
/**
 * Schema of {@link AST.SlotElement} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SLOT_ELEMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SLOT_ELEMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSlotElement(input: unknown): input is AST.SlotElement {
	return v.is(SLOT_ELEMENT, input);
}

/**
 * Type literal for {@link AST.SvelteBody}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_BODY = "SvelteBody";
/**
 * Schema of {@link AST.SvelteBody} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_BODY = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_BODY),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteBody(input: unknown): input is AST.SvelteBody {
	return v.is(SVELTE_BODY, input);
}

/**
 * Type literal for {@link AST.SvelteBoundary}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_BOUNDARY = "SvelteBoundary";
/**
 * Schema of {@link AST.SvelteBoundary} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_BOUNDARY = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_BOUNDARY),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteBoundary(input: unknown): input is AST.SvelteBoundary {
	return v.is(SVELTE_BOUNDARY, input);
}

/**
 * Type literal for {@link AST.SvelteComponent}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_COMPONENT = "SvelteComponent";
/**
 * Schema of {@link AST.SvelteComponent} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_COMPONENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_COMPONENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteComponent(input: unknown): input is AST.SvelteComponent {
	return v.is(SVELTE_COMPONENT, input);
}

/**
 * Type literal for {@link AST.SvelteDocument}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_DOCUMENT = "SvelteDocument";
/**
 * Schema of {@link AST.SvelteDocument} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_DOCUMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_DOCUMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteDocument(input: unknown): input is AST.SvelteDocument {
	return v.is(SVELTE_DOCUMENT, input);
}

/**
 * Type literal for {@link AST.SvelteElement}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_ELEMENT = "SvelteElement";
/**
 * Schema of {@link AST.SvelteElement} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_ELEMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_ELEMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteElement(input: unknown): input is AST.SvelteElement {
	return v.is(SVELTE_ELEMENT, input);
}

/**
 * Type literal for {@link AST.SvelteFragment}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_FRAGMENT = "SvelteFragment";
/**
 * Schema of {@link AST.SvelteFragment} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_FRAGMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_FRAGMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteFragment(input: unknown): input is AST.SvelteFragment {
	return v.is(SVELTE_FRAGMENT, input);
}

/**
 * Type literal for {@link AST.SvelteHead}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_HEAD = "SvelteHead";
/**
 * Schema of {@link AST.SvelteHead} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_HEAD = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_HEAD),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteHead(input: unknown): input is AST.SvelteHead {
	return v.is(SVELTE_HEAD, input);
}

/**
 * Type literal for {@link AST.SvelteSelf}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_SELF = "SvelteSelf";
/**
 * Schema of {@link AST.SvelteSelf} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_SELF = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_SELF),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteSelf(input: unknown): input is AST.SvelteSelf {
	return v.is(SVELTE_SELF, input);
}

/**
 * Type literal for {@link AST.SvelteWindow}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_WINDOW = "SvelteWindow";
/**
 * Schema of {@link AST.SvelteWindow} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_WINDOW = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_WINDOW),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteWindow(input: unknown): input is AST.SvelteWindow {
	return v.is(SVELTE_WINDOW, input);
}

/**
 * Type literal for {@link AST.TitleElement}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TITLE_ELEMENT = "TitleElement";
/**
 * Schema of {@link AST.TitleElement} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const TITLE_ELEMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_TITLE_ELEMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isTitleElement(input: unknown): input is AST.TitleElement {
	return v.is(TITLE_ELEMENT, input);
}

/**
 * Set containing all of the types related to element-like AST nodes.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_ELEMENT_LIKE = new Set<AST.ElementLike["type"]>([
	TYPE_COMPONENT,
	TYPE_REGULAR_ELEMENT,
	TYPE_SLOT_ELEMENT,
	TYPE_SVELTE_BODY,
	TYPE_SVELTE_BOUNDARY,
	TYPE_SVELTE_COMPONENT,
	TYPE_SVELTE_DOCUMENT,
	TYPE_SVELTE_ELEMENT,
	TYPE_SVELTE_FRAGMENT,
	TYPE_SVELTE_HEAD,
	TYPE_SVELTE_OPTIONS,
	TYPE_SVELTE_SELF,
	TYPE_SVELTE_WINDOW,
	TYPE_TITLE_ELEMENT,
]);
/**
 * Schema of {@link AST.ElementLike} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ELEMENT_LIKE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_ELEMENT_LIKE).toArray()),
});
/**
 * Type check guard to see if provided AST node is "element-like" {@link AST.ElementLike}.
 *
 * Those are:
 *
 * - standard Svelte-based component - {@link AST.Component}
 * - regular element _(HTML based)_ - {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
 * - special Svelte elements - {@link https://svelte.dev/docs/special-elements}
 *
 * @param  input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isElementLike(input: unknown): input is AST.ElementLike {
	return v.is(ELEMENT_LIKE, input);
}
