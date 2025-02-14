/**
 * Printers related to Svelte **JS** AST nodes only.
 * @module svelte-ast-print/js
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import { print_js } from "../_internal/js.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import { printAttributeLike } from "../template/mod.js";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printScript(n: SV.Script, opts: Partial<PrintOptions> = {}): Result<SV.Script> {
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
