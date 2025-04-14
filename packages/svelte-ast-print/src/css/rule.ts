/**
 * Printers related to CSS **rule** related AST nodes only.
 * @module svelte-ast-print/css/rule
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import type { PrintOptions } from "../_internal/option.ts";
import { type Result, State } from "../_internal/shared.ts";
import { CurlyBrackets } from "../_internal/wrapper.ts";
import { printCSSSelectorList } from "./selector.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSBlock(n: SV.CSS.Block, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Block> {
	const st = State.get(n, opts);
	const brackets = new CurlyBrackets("mutliline");
	for (const ch of n.children) {
		switch (ch.type) {
			case "Declaration": {
				brackets.insert(printCSSDeclaration(ch, opts));
				break;
			}
			case "Rule": {
				brackets.insert(printCSSRule(ch, opts));
				break;
			}
			case "Atrule": {
				brackets.insert(printCSSAtrule(ch, opts));
				break;
			}
		}
	}
	st.add(brackets);
	return st.result;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSDeclaration(
	n: SV.CSS.Declaration,
	opts: Partial<PrintOptions> = {},
): Result<SV.CSS.Declaration> {
	const st = State.get(n, opts);
	st.add(
		//
		n.property,
		char.COLON,
		char.SPACE,
		n.value.split(/[\n|\t]+/g).join(char.SPACE),
		char.SEMI,
	);
	return st.result;
}

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSAtrule(n: SV.CSS.Atrule, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Atrule> {
	const st = State.get(n, opts);
	st.add(char.AT, n.name, char.SPACE, n.prelude);
	if (n.block) st.add(char.SPACE, printCSSBlock(n.block, opts));
	else st.add(char.SEMI);
	return st.result;
}

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printCSSRule(n: SV.CSS.Rule, opts: Partial<PrintOptions> = {}): Result<SV.CSS.Rule> {
	const st = State.get(n, opts);
	st.add(
		//
		printCSSSelectorList(n.prelude, opts),
		char.SPACE,
		printCSSBlock(n.block, opts),
	);
	return st.result;
}
