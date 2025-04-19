/**
 * ## Usage
 *
 * There are two ways to use this package.
 *
 * @example Recommended usage
 *
 * If you know which _specific_ AST node from Svelte syntax you want to print.\
 * There are 4 categories of AST nodes available and their respective submodules:
 *
 * - CSS - `"svelte-ast-print/css"`
 * - HTML - `"svelte-ast-print/html"`
 * - JavaScript & TypeScript - `"svelte-ast-print/js"`
 * - Svelte template - `"svelte-ast-print/template"`
 *
 * Let's take for example {@link SV.SnippetBlock} which is a Svelte template-related node.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { printSnippetBlock } from "svelte-ast-print/template/block";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.SnippetBlock;
 *
 * const stringified = printSnippetBlock(node);
 * ```
 *
 * @example General usage
 *
 * If you _don't know_ which AST node from Svelte syntax you want to print.
 * It could be either JavaScript/TypeScript _(ESTree specification complaint)_ or Svelte.
 * Under the hood it uses {@link esrap#print}.
 *
 * ```ts
 * import type * as JS from "estree";
 * import type { AST as SV } from "svelte/compiler";
 * import { print } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: JS.Node | SV.BaseNode;
 *
 * const stringified = print(node);
 * ```
 *
 * @example General usage - Svelte only
 *
 * If you _don't know_ which AST node from Svelte syntax you want to print, but you _know_ that it's Svelte.
 *
 * ```ts
 * import type { AST } from "svelte/compiler";
 * import { printSvelte } from "svelte-ast-print";
 *
 * // How you obtain the node is up to you.
 * // Either by building programmatically or from parsing
 * let node: AST.BaseNode;
 *
 * const stringified = printSvelte(node);
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

import type esrap from "esrap";
import type * as JS from "estree";
import type { AST as SV } from "svelte/compiler";

import { print_js } from "./_internal/js.ts";
import type { PrintOptions } from "./_internal/option.ts";
import { isSvelteOnlyNode, type Result, State } from "./_internal/shared.ts";
import type { SvelteOnlyNode } from "./_internal/type.ts";
import type { Node } from "./_internal/type.ts";
import { printCSSNode } from "./css.ts";
import { printFragment } from "./fragment.ts";
import { printRoot, printScript } from "./template/root.ts";
import { printTemplateNode } from "./template.ts";

/**
 * @param n Svelte or JavaScript/TypeScript ESTree specification complaint AST node
 * @param opts printing options
 * @returns Stringified Svelte AST node
 * @since 1.0.0
 *
 * @__NO_SIDE_EFFECTS__
 */
export function print<N extends Node>(n: N, opts: Partial<PrintOptions> = {}): Result<N> {
	if (isSvelteOnlyNode(n)) return printSvelte(n, opts) as Result<N>;
	else {
		const st = State.get(n, opts);
		st.add(print_js(n, st.opts));
		return st.result as Result<N>;
	}
}

/**
 * @param n Svelte AST node
 * @param opts printing options
 * @returns Stringified Svelte AST node
 * @since 1.0.0
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelte<N extends SvelteOnlyNode>(n: N, opts: Partial<PrintOptions> = {}): Result<N> {
	switch (n.type) {
		case "Root": {
			return printRoot(n, opts) as Result<N>;
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
			return printCSSNode(n, opts) as Result<N>;
		}
		case "Fragment": {
			return printFragment(n, opts) as Result<N>;
		}
		case "Script": {
			return printScript(n, opts) as Result<N>;
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
			return printTemplateNode(n, opts) as Result<N>;
		}
	}
}
