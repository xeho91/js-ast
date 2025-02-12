/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "../_internal/option.js";
 * @import { Result } from "../_internal/shared.js";
 */

/**
 * Printers related to Svelte **JS** AST nodes only.
 * @module svelte-ast-print/js
 */

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import { print_js } from "../_internal/js.js";
import { State } from "../_internal/shared.js";
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
