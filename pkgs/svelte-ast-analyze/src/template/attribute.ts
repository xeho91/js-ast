/**
 * Related to {@link AST.AttributeLike}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.Attribute}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ATTRIBUTE = "Attribute";
/**
 * Schema of {@link AST.Attribute} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ATTRIBUTE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_ATTRIBUTE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isAttribute(input: unknown): input is AST.Attribute {
	return v.is(ATTRIBUTE, input);
}

/**
 * Type literal for {@link AST.SpreadAttribute}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SPREAD_ATTRIBUTE = "SpreadAttribute" as const;
/**
 * Schema of {@link AST.SpreadAttribute} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SPREAD_ATTRIBUTE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SPREAD_ATTRIBUTE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSpreadAttribute(input: unknown): input is AST.SpreadAttribute {
	return v.is(SPREAD_ATTRIBUTE, input);
}

/**
 * Type literal for {@link AST.AnimateDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ANIMATE_DIRECTIVE = "AnimateDirective" as const;
/**
 * Schema of {@link AST.AnimateDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ANIMATE_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_ANIMATE_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isAnimateDirective(input: unknown): input is AST.AnimateDirective {
	return v.is(ANIMATE_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.BindDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_BIND_DIRECTIVE = "BindDirective" as const;
/**
 * Schema of {@link AST.BindDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const BIND_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_BIND_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isBindDirective(input: unknown): input is AST.BindDirective {
	return v.is(BIND_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.ClassDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CLASS_DIRECTIVE = "ClassDirective" as const;
/**
 * Schema of {@link AST.ClassDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const CLASS_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CLASS_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isClassDirective(input: unknown): input is AST.ClassDirective {
	return v.is(CLASS_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.LetDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_LET_DIRECTIVE = "LetDirective" as const;
/**
 * Schema of {@link AST.LetDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const LET_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_LET_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isLetDirective(input: unknown): input is AST.LetDirective {
	return v.is(LET_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.OnDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ON_DIRECTIVE = "OnDirective" as const;
/**
 * Schema of {@link AST.OnDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ON_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_ON_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isOnDirective(input: unknown): input is AST.OnDirective {
	return v.is(ON_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.StyleDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_STYLE_DIRECTIVE = "StyleDirective" as const;
/**
 * Schema of {@link AST.StyleDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const STYLE_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_STYLE_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isStyleDirective(input: unknown): input is AST.StyleDirective {
	return v.is(STYLE_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.TransitionDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_TRANSITION_DIRECTIVE = "TransitionDirective" as const;
/**
 * Schema of {@link AST.TransitionDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const TRANSITION_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_TRANSITION_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isTransitionDirective(input: unknown): input is AST.TransitionDirective {
	return v.is(TRANSITION_DIRECTIVE, input);
}

/**
 * Type literal for {@link AST.UseDirective}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_USE_DIRECTIVE = "UseDirective" as const;
/**
 * Schema of {@link AST.UseDirective} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const USE_DIRECTIVE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_USE_DIRECTIVE),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isUseDirective(input: unknown): input is AST.UseDirective {
	return v.is(USE_DIRECTIVE, input);
}
/**
 * Set containing all of the types related to {@link AST.AttributeLike} nodes.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_ATTRIBUTE_LIKE = new Set<AST.AttributeLike["type"]>([
	TYPE_ATTRIBUTE,
	TYPE_SPREAD_ATTRIBUTE,
	TYPE_ANIMATE_DIRECTIVE,
	TYPE_BIND_DIRECTIVE,
	TYPE_CLASS_DIRECTIVE,
	TYPE_LET_DIRECTIVE,
	TYPE_ON_DIRECTIVE,
	TYPE_STYLE_DIRECTIVE,
	TYPE_USE_DIRECTIVE,
]);
/**
 * Schema of {@link AST.AttributeLike} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ATTRIBUTE_LIKE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_ATTRIBUTE_LIKE).toArray()),
});
/**
 * Type check guard to check if provided AST node is {@link AST.AttributeLike}.
 *
 * - Standard attribute _({@link AST.Attribute})_ - {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * - Spread attribute _({@link AST.SpreadAttribute})_ - {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * - Directive _({@link AST.Directive})_ - can be for:
 *   - component - {@link https://svelte.dev/docs/component-directives}
 *   - element - {@link https://svelte.dev/docs/element-directives}
 *
 * @param input - AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 */
export function isAttributeLike(input: unknown): input is AST.AttributeLike {
	return v.is(ATTRIBUTE_LIKE, input);
}
