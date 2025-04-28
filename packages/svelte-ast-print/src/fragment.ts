/**
 * Printer related to Svelte **fragment** AST nodes only.
 * @module svelte-ast-print/fragment
 */

import type { AST as SV } from "svelte/compiler";
import type { PrintOptions } from "./_internal/option.ts";
import { type Result, State } from "./_internal/shared.ts";
import { isBlock } from "./_internal/template/block.ts";
import { isElementLike } from "./_internal/template/element-like.ts";
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
	/** @type {SV.Fragment["nodes"]} */
	let nodes: SV.Fragment["nodes"] = [];
	for (const [idx, ch] of n.nodes.entries()) {
		const prev = n.nodes[idx - 1];
		const next = n.nodes[idx + 1];
		if (ch.type === "Text") {
			if (ch.raw === " " && (prev?.type === "ExpressionTag" || next?.type === "ExpressionTag")) {
				nodes.push(ch);
				continue;
			}
			if (!(/^(?: {1,}|\t|\n)*$/.test(ch.raw) || /^(?: {2,}|\t|\n)*$/.test(ch.raw))) {
				// biome-ignore format: Prettier
				// prettier-ignore
				ch.raw = ch.raw
					.replace(/^[\n\t]+/, "")
					.replace(/[\n\t]+$/, "");
				nodes.push(ch);
			}
			continue;
		}
		nodes.push(ch);
	}
	for (const [idx, ch] of nodes.entries()) {
		const prev = nodes[idx - 1];
		if (prev && (isBlock(prev) || prev.type === "Comment" || isElementLike(prev))) {
			st.break();
		}
		// biome-ignore format: Prettier
		// prettier-ignore
		switch (ch.type) {
			case "AwaitBlock":
			case "KeyBlock":
			case "EachBlock":
			case "IfBlock":
			case "SnippetBlock": st.add(printBlock(ch, opts)); break;
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
			case "TitleElement": st.add(printElementLike(ch, opts)); break;
			case "ConstTag":
			case "DebugTag":
			case "ExpressionTag":
			case "HtmlTag":
			case "RenderTag": st.add(printTag(ch, opts));break;
			case "Comment":
			case "Text": st.add(printHTMLNode(ch, opts)); break;
		}
	}
	return st.result;
}
