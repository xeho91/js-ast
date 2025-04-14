/**
 * Related to {@link AST.Root}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.Root}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_ROOT = "Root";
/**
 * Schema of {@link AST.Root} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const ROOT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_ROOT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isRoot(input: unknown): input is AST.Root {
	return v.is(ROOT, input);
}
