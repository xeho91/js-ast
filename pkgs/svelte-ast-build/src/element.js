/**
 * Related to {@link AST.ElementLike}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Set containing all of the types related to element-like AST nodes.
 * @type {Set<AST.ElementLike['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_ELEMENT_LIKE = new Set([
	"Component",
	"RegularElement",
	"SlotElement",
	"SvelteBody",
	"SvelteBoundary",
	"SvelteComponent",
	"SvelteDocument",
	"SvelteElement",
	"SvelteFragment",
	"SvelteHead",
	"SvelteOptions",
	"SvelteSelf",
	"SvelteWindow",
	"TitleElement",
]);

/**
 * Type check guard to see if provided AST node is "element-like" {@link AST.ElementLike}.
 *
 * Those are:
 *
 * - standard Svelte-based component - {@link AST.Component}
 * - regular element _(HTML based)_ - {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
 * - special Svelte elements - {@link https://svelte.dev/docs/special-elements}
 *
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.ElementLike}
 * @__NO_SIDE_EFFECTS__
 */
export const isElementLike = (node) =>
	TYPES_ELEMENT_LIKE
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);
