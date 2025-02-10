/**
 * @import { AST as SV } from "svelte/compiler";
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { Result } from "./_state.js";

/**
 * @param {SV.Fragment} n
 * @param {Partial<PrintOptions>} [opts]
 * @returns {Result<SV.Fragment>}
 * @__NO_SIDE_EFFECTS__
 */
export function printFragment(n, opts) {
	return JSON.stringify(n);
}
