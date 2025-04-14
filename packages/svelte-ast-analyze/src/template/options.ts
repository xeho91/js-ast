/**
 * Related to {@link AST.SvelteOptions}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Type literal for {@link AST.SvelteOptions}
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SVELTE_OPTIONS = "SvelteOptions";
/**
 * Schema of {@link AST.SvelteOptions} for validation purposes.
 * @__NO_SIDE_EFFECTS__
 */
export const SVELTE_OPTIONS = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SVELTE_OPTIONS),
});
/**
 * @param input - AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isSvelteOptions(input: unknown): input is AST.SvelteOptionsRaw {
	return v.is(SVELTE_OPTIONS, input);
}
