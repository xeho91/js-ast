/**
 * Related to {@link AST.Block}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Set containing all of the types related to block AST nodes.
 * The ones with pattern `{#<block-name>} ... {/<block-name>}`.
 * @type {Set<AST.Block['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_BLOCK = new Set([
	//
	"AwaitBlock",
	"EachBlock",
	"IfBlock",
	"KeyBlock",
	"SnippetBlock",
]);
/**
 * Type check guard to check if provided AST node is a logic block {@link AST.Block}.
 *
 * @see {@link https://svelte.dev/docs/logic-blocks}
 *
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Block}
 * @__NO_SIDE_EFFECTS__
 */
export function isBlock(node) {
	return (
		TYPES_BLOCK
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
