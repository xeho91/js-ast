/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "../_option.js";
 * @import { Result } from "../_internal.js";
 */

import * as char from "../_char.js";
import { State, print_js } from "../_internal.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../html/mod.js";
import { printAttributeLike } from "../template/mod.js";

/**
 * @param {SV.Script} n
 * @param {Partial<PrintOptions>} [opts]
 * @returns {Result<SV.Script>}
 * @__NO_SIDE_EFFECTS__
 */
export function printScript(n, opts = {}) {
	const name = "script";
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", name);
	if (n.attributes.length > 0) {
		for (const a of n.attributes) opening.insert(char.SPACE, printAttributeLike(a));
	}
	st.add(opening);
	st.break(+1);
	st.add(print_js(n.content, st.opts));
	st.break(-1);
	st.add(new HTMLClosingTag("inline", name));
	return st.result;
}
