/**
 * Related to {@link AST.Fragment}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.Fragment}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_FRAGMENT = "Fragment";
/**
 * Schema of {@link AST.Fragment} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const FRAGMENT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_FRAGMENT),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isFragment(input: unknown): input is AST.Fragment {
	return v.is(FRAGMENT, input);
}
