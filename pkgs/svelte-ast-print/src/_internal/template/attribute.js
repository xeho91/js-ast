/**
 * @import * as JS from "estree";
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { Result } from "../../_internal/shared.js";
 * @import { PrintOptions } from "../option.js";
 */

import { print_js } from "../../_internal/js.js";
import { State } from "../../_internal/shared.js";
import { CurlyBrackets } from "../../_internal/wrapper.js";
import * as char from "../char.js";

/**
 * @param {Exclude<SV.AttributeLike, SV.SpreadAttribute>} n
 * @param {JS.Expression} exp
 * @returns {boolean}
 */
export function is_attr_exp_shorthand(n, exp) {
	return exp.type === "Identifier" && exp.name === n.name;
}

/**
 * @internal
 * Abstraction for printing shared schema in directives
 *
 * @template {Exclude<SV.Directive, SV.StyleDirective>} N
 * @param {string} name
 * @param {N} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<N>}
 * @__NO_SIDE_EFFECTS__
 */
export function print_directive(name, n, opts = {}) {
	const st = State.get(n, opts);
	st.add(name, char.COLON, n.name);
	if ("modifiers" in n && n.modifiers.length > 0) st.add(char.PIPE, n.modifiers.join(char.PIPE));
	if (n.expression && !is_attr_exp_shorthand(n, n.expression)) {
		st.add(char.ASSIGN, new CurlyBrackets("inline", print_js(n.expression, st.opts)));
	}
	return st.result;
}
