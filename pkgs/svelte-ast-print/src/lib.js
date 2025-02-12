/**
 * @import * as JS from "estree";
 * @import { AST as SV } from "svelte/compiler";
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./_internal/option.js";
 * @import { Result } from "./_internal/shared.js";
 */

/**
 * ## Usage
 *
 * There are two ways to use this package.
 *
 * @example Recommended usage
 *
 * If you know which _specific_ AST node from Svelte syntax you want to print. For example {@link SV.SnippetBlock}.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { printSvelteSnippet } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.SnippetBlock;
 *
 * const stringified = printSvelteSnippet(node);
 * ```
 *
 * @example General usage
 *
 * If you _don't know_ which AST node from Svelte syntax you want to print.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { print } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.BaseNode;
 *
 * const stringified = print(node);
 * ```
 *
 * ---
 *
 * ## Options
 *
 * Every `print*` function accepts a second argument for options. Is optional and has some sensible defaults.
 *
 * @see {@link PrintOptions}
 *
 * @module svelte-ast-print
 */

import { isSvelteOnly } from "svelte-ast-build";

import { print_js } from "./_internal/js.js";
import { State } from "./_internal/shared.js";
import { printCSS } from "./css/mod.js";
import { printScript } from "./js/mod.js";
import { printFragment, printRoot, printTemplate } from "./template/mod.js";

/**
 *
 * @template {JS.Node | SvelteOnlyNode} N
 * @param {N} n - Svelte or ESTree AST node
 * @param {Partial<PrintOptions>} [opts] - printing options
 * @returns {Result<N>} Stringified Svelte AST node
 */
export function print(n, opts = {}) {
	const st = State.get(n, opts);
	if (isSvelteOnly(n)) {
		switch (n.type) {
			case "Root": {
				st.add(printRoot(n, opts));
				break;
			}
			// CSS
			case "Block":
			case "Combinator":
			case "Declaration":
			case "AttributeSelector":
			case "ClassSelector":
			case "ComplexSelector":
			case "IdSelector":
			case "NestingSelector":
			case "PseudoClassSelector":
			case "PseudoElementSelector":
			case "RelativeSelector":
			case "TypeSelector":
			case "SelectorList":
			case "Nth":
			case "Percentage":
			case "Atrule":
			case "Rule":
			case "StyleSheet": {
				st.add(printCSS(n, opts));
				break;
			}
			case "Fragment": {
				st.add(printFragment(n, opts));
				break;
			}
			case "Script": {
				st.add(printScript(n, opts));
				break;
			}
			// attribute-like
			case "Attribute":
			case "SpreadAttribute":
			case "AnimateDirective":
			case "BindDirective":
			case "ClassDirective":
			case "LetDirective":
			case "OnDirective":
			case "StyleDirective":
			case "TransitionDirective":
			case "UseDirective":
			// block
			case "AwaitBlock":
			case "KeyBlock":
			case "EachBlock":
			case "IfBlock":
			case "SnippetBlock":
			// element-like
			case "Component":
			case "RegularElement":
			case "SlotElement":
			case "SvelteBody":
			case "SvelteBoundary":
			case "SvelteComponent":
			case "SvelteDocument":
			case "SvelteElement":
			case "SvelteFragment":
			case "SvelteHead":
			case "SvelteOptions":
			case "SvelteSelf":
			case "SvelteWindow":
			case "TitleElement":
			// tag
			case "ConstTag":
			case "DebugTag":
			case "ExpressionTag":
			case "HtmlTag":
			case "RenderTag":
			// HTML
			case "Comment":
			case "Text": {
				st.add(printTemplate(n, opts));
				break;
			}
		}
	} else st.add(print_js(n, st.opts));
	return st.result;
}

export * from "./css/mod.js";
export * from "./js/mod.js";
export * from "./html/mod.js";
export * from "./template/mod.js";
