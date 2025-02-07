/**
 * Private and shared internal utilities.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * @internal
 * Determine if the input fits the AST node object schema.
 * @param {unknown} input
 * @returns {node is AST.BaseNode}
 * @__NO_SIDE_EFFECTS__
 */
export function is_base_node(input) {
	return typeof input === "object" && input !== null && "type" in input;
}
