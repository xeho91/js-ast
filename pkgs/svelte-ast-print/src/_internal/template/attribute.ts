import type * as JS from "estree";
import type { AST as SV } from "svelte/compiler";

import * as char from "../char.ts";
import { print_js } from "../js.ts";
import type { PrintOptions } from "../option.ts";
import { type Result, State } from "../shared.ts";
import { CurlyBrackets } from "../wrapper.ts";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export function is_attr_exp_shorthand(n: Exclude<SV.AttributeLike, SV.SpreadAttribute>, exp: JS.Expression): boolean {
	return exp.type === "Identifier" && exp.name === n.name;
}

/**
 * @internal
 * Abstraction for printing shared schema in directives.
 * @__NO_SIDE_EFFECTS__
 */
export function print_directive<N extends Exclude<SV.Directive, SV.StyleDirective>>(
	name: string,
	n: N,
	opts: Partial<PrintOptions> = {},
): Result<N> {
	const st = State.get(n, opts);
	st.add(name, char.COLON, n.name);
	if ("modifiers" in n && n.modifiers.length > 0) st.add(char.PIPE, n.modifiers.join(char.PIPE));
	if (n.expression && !is_attr_exp_shorthand(n, n.expression)) {
		st.add(char.ASSIGN, new CurlyBrackets("inline", print_js(n.expression, st.opts)));
	}
	return st.result;
}
