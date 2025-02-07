/**
 * @import * as JS from "estree";
 * @import { AST } from "svelte/compiler";
 */

import { TYPE_CSS } from "./css/mod.js";
import { TYPE_FRAGMENT } from "./fragment.js";
import { TYPE_SVELTE_OPTIONS } from "./options.js";
import { TYPE_SCRIPT } from "./script.js";
import { TYPES_TEMPLATE } from "./template.js";

/**
 * Set containing all of the AST node types supported by Svelte.
 * @type {Set<AST.SvelteNode['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_SVELTE = new Set(
	/** @type {const} */ ([
		// TODO: Add nodes from estree
		TYPE_FRAGMENT,
	]),
)
	.union(TYPE_CSS)
	.union(TYPES_TEMPLATE);

/**
 * @param {AST.BaseNode} node - ESTree or Svelte AST node
 * @returns {node is AST.SvelteNode}
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelte(node) {
	return (
		TYPES_SVELTE
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}

/**
 * @typedef {AST.Script | AST.SvelteOptionsRaw | Exclude<AST.SvelteNode, JS.Node>} SvelteOnlyNode AST nodes which comes from Svelte syntax only.
 */

/**
 * Set containing all of the AST node types related to Svelte syntax only.
 * @type {Set<SvelteOnlyNode['type']>}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPES_SVELTE_ONLY = new Set(
	/** @type {const} */ ([
		//
		TYPE_FRAGMENT,
		TYPE_SVELTE_OPTIONS,
		TYPE_SCRIPT,
	]),
)
	.union(TYPE_CSS)
	.union(TYPES_TEMPLATE);
/**
 * @param {AST.BaseNode | JS.BaseNode} node - ESTree or Svelte AST node
 * @returns {node is SvelteOnlyNode}
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteOnly(node) {
	return (
		TYPES_SVELTE_ONLY
			// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
			.has(node.type)
	);
}
