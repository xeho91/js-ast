/**
 * Printers related to Svelte **template**-related AST nodes only.
 * @module svelte-ast-print/template
 */

import type { AST as SV } from "svelte/compiler";

import type { PrintOptions } from "./_internal/option.ts";
import type { Result } from "./_internal/shared.ts";
import { printAttributeLike } from "./template/attribute-like.ts";
import { printBlock } from "./template/block.ts";
import { printElementLike } from "./template/element-like.ts";
import { printHTMLNode } from "./template/html.ts";
import { printRoot } from "./template/root.ts";
import { printTag } from "./template/tag.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printTemplateNode(
	n: SV.TemplateNode,
	opts: Partial<PrintOptions> = {},
): Result<SV.TemplateNode> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Attribute":
		case "SpreadAttribute":
		case "AnimateDirective":
		case "BindDirective":
		case "ClassDirective":
		case "LetDirective":
		case "OnDirective":
		case "StyleDirective":
		case "TransitionDirective":
		case "UseDirective": return printAttributeLike(n, opts);
		case "AwaitBlock":
		case "KeyBlock":
		case "EachBlock":
		case "IfBlock":
		case "SnippetBlock": return printBlock(n, opts);
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
		case "TitleElement": return printElementLike(n, opts);
		case "ConstTag":
		case "DebugTag":
		case "ExpressionTag":
		case "HtmlTag":
		case "RenderTag": return printTag(n, opts);
		case "Comment":
		case "Text": return printHTMLNode(n, opts);
		case "Root": return printRoot(n, opts);
	}
}

export * from "./template/attribute-like.ts";
export * from "./template/block.ts";
export * from "./template/element-like.ts";
export * from "./template/html.ts";
export * from "./template/tag.ts";
