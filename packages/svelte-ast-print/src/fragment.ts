/**
 * Printer related to Svelte **fragment** AST nodes only.
 * @module svelte-ast-print/fragment
 */

import type { AST as SV } from "svelte/compiler";
import type { PrintOptions } from "./_internal/option.ts";
import { type Result, State } from "./_internal/shared.ts";
import { printBlock } from "./template/block.ts";
import { printElementLike } from "./template/element-like.ts";
import { printHTMLNode } from "./template/html.ts";
import { printTag } from "./template/tag.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printFragment(n: SV.Fragment, opts: Partial<PrintOptions> = {}): Result<SV.Fragment> {
	const st = State.get(n, opts);
	for (const node of n.nodes) {
		switch (node.type) {
			case "AwaitBlock":
			case "KeyBlock":
			case "EachBlock":
			case "IfBlock":
			case "SnippetBlock": {
				st.add(printBlock(node, opts));
				break;
			}
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
			case "TitleElement": {
				st.add(printElementLike(node, opts));
				break;
			}
			case "ConstTag":
			case "DebugTag":
			case "ExpressionTag":
			case "HtmlTag":
			case "RenderTag": {
				st.add(printTag(node, opts));
				break;
			}
			case "Comment":
			case "Text": {
				st.add(printHTMLNode(node, opts));
				break;
			}
		}
	}
	return st.result;
}
