/**
 * Related to {@link AST.SvelteNode}.
 * @module
 */

import type * as JS from "estree";
import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE, isBaseNode } from "./base.ts";
import { TYPES_CSS_NODE } from "./css/mod.ts";
import { TYPE_SCRIPT } from "./js/mod.ts";
import { TYPE_FRAGMENT } from "./template/fragment.ts";
import { TYPES_TEMPLATE_NODE } from "./template/mod.ts";
import { TYPE_SVELTE_OPTIONS } from "./template/options.ts";

/**
 * Set containing all of the AST node types supported by Svelte.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_SVELTE = new Set<AST.SvelteNode["type"]>([
	// TODO: Add nodes from estree
	TYPE_FRAGMENT,
] as const)
	.union(TYPES_CSS_NODE)
	.union(TYPES_TEMPLATE_NODE);

/**
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteNode(node: unknown): node is AST.SvelteNode {
	return (
		isBaseNode(node) &&
		TYPES_SVELTE
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}

/**
 * AST nodes which comes from Svelte syntax only.
 */
export type SvelteOnlyNode = AST.Script | AST.SvelteOptionsRaw | Exclude<AST.SvelteNode, JS.Node>;

/**
 * Set containing all of the AST node types related to Svelte syntax only.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_SVELTE_ONLY = new Set<SvelteOnlyNode["type"]>([
	//
	TYPE_FRAGMENT,
	TYPE_SVELTE_OPTIONS,
	TYPE_SCRIPT,
] as const)
	.union(TYPES_CSS_NODE)
	.union(TYPES_TEMPLATE_NODE);

export const SVELTE_ONLY_NODE = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.picklist(Iterator.from(TYPES_SVELTE_ONLY).toArray()),
});

/**
 * @param node ESTree or Svelte AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteOnlyNode(node: unknown): node is SvelteOnlyNode {
	return v.is(SVELTE_ONLY_NODE, node);
}
