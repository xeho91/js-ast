/**
 * Private and shared internal utilities.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

export const BASE_NODE = v.object({
	type: v.string(),
	start: v.optional(v.number()),
	end: v.optional(v.number()),
});

/**
 * Determine if the input fits the AST node object schema.
 * @__NO_SIDE_EFFECTS__
 */
export function isBaseNode(input: unknown): input is AST.BaseNode {
	return v.is(BASE_NODE, input);
}
