/**
 * Related to {@link AST.Block}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.AwaitBlock}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_AWAIT_BLOCK = "AwaitBlock";
/**
 * Schema of {@link AST.AwaitBlock} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const AWAIT_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_AWAIT_BLOCK),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isAwaitBlock(input: unknown): input is AST.AwaitBlock {
	return v.is(AWAIT_BLOCK, input);
}

/**
 * Type literal for {@link AST.EachBlock}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_EACH_BLOCK = "EachBlock";
/**
 * Schema of {@link AST.EachBlock} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const EACH_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_EACH_BLOCK),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isEachBlock(input: unknown): input is AST.EachBlock {
	return v.is(EACH_BLOCK, input);
}

/**
 * Type literal for {@link AST.IfBlock}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_IF_BLOCK = "IfBlock";
/**
 * Schema of {@link AST.IfBlock} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const IF_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_IF_BLOCK),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isIfBlock(input: unknown): input is AST.IfBlock {
	return v.is(IF_BLOCK, input);
}

/**
 * Type literal for {@link AST.KeyBlock}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_KEY_BLOCK = "KeyBlock";
/**
 * Schema of {@link AST.KeyBlock} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const KEY_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_KEY_BLOCK),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isKeyBlock(input: unknown): input is AST.KeyBlock {
	return v.is(KEY_BLOCK, input);
}

/**
 * Type literal for {@link AST.SnippetBlock}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SNIPPET_BLOCK = "SnippetBlock";
/**
 * Schema of {@link AST.SnippetBlock} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SNIPPET_BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SNIPPET_BLOCK),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSnippetBlock(input: unknown): input is AST.SnippetBlock {
	return v.is(SNIPPET_BLOCK, input);
}

/**
 * Set containing all of the types related to {@link AST.Block} nodes.
 * The ones with pattern `{#<block-name>} ... {/<block-name>}`.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_BLOCK = new Set<AST.Block["type"]>([
	TYPE_AWAIT_BLOCK,
	TYPE_EACH_BLOCK,
	TYPE_IF_BLOCK,
	TYPE_KEY_BLOCK,
	TYPE_SNIPPET_BLOCK,
]);
export const BLOCK = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_BLOCK).toArray()),
});
/**
 * Type check guard to check if provided AST node is a logic block {@link AST.Block}.
 *
 * @see {@link https://svelte.dev/docs/logic-blocks}
 *
 * @param input - AST Node
 * @__NO_SIDE_EFFECTS__
 */
export function isBlock(input: unknown): input is AST.Block {
	return v.is(BLOCK, input);
}
