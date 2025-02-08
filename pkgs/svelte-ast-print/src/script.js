/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { print as print_js } from "esrap";

import { NL, Result, SP } from "./_result.js";
import { printAttributeLike } from "./attribute.js";
import { EL } from "./element.js";

/**
 * @param {SV.Script} n
 * @param {Partial<PrintOptions>} [opts]
 * @returns {Result<SV.Script>}
 * @__NO_SIDE_EFFECTS__
 */
export function printScript(n, opts) {
	const name = "script";
	const res = new Result(n, opts);
	res.add_ln_with_pcs(
		EL.open(name),
		n.attributes.length > 0 && SP,
		n.attributes.map((a) => printAttributeLike(a).toString()).join(SP),
		EL.END,
	);
	res.depth++;
	res.add_ln_with_pcs(
		// TODO: Align with `esrap`, if it evers become pluggable
		// Ref: https://github.com/sveltejs/esrap/issues/35
		print_js(n.content, { indent: res.opts.indent })
			.code.split(NL)
			.map((ln, idx) => {
				// NOTE: We skip first line
				if (!idx || !ln) return ln;
				return `${res.opts.indent}${ln}`;
			})
			.join(NL),
	);
	res.depth--;
	res.add_ln_with_pcs(EL.close(name));
	return res;
}
