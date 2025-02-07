/**
 * Related to {@link AST.AttributeLike}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Set containing all of the types related to attribute-like AST nodes.
 * @type {Set<AST.AttributeLike['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_ATTRIBUTE_LIKE = new Set([
	"AnimateDirective",
	"Attribute",
	"BindDirective",
	"ClassDirective",
	"LetDirective",
	"OnDirective",
	"SpreadAttribute",
	"StyleDirective",
	"TransitionDirective",
	"UseDirective",
]);

/**
 * Type check guard to check if provided AST node is {@link AST.AttributeLike}.
 *
 * - Standard attribute _({@link AST.Attribute})_ - {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * - Spread attribute _({@link AST.SpreadAttribute})_ - {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * - Directive _({@link AST.Directive})_ - can be for:
 *   - component - {@link https://svelte.dev/docs/component-directives}
 *   - element - {@link https://svelte.dev/docs/element-directives}
 *
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.AttributeLike}
 * @__NO_SIDE_EFFECTS__
 */
export function isAttributeLike(node) {
	return (
		TYPES_ATTRIBUTE_LIKE
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
