/**
 * Printers related to Svelte **template**-related AST nodes only.
 * @module svelte-ast-print/template
 */

import type { AST as SV } from "svelte/compiler";

import type { PrintOptions } from "./_internal/option.ts";
import type { Result } from "./_internal/shared.ts";
import { printAttributeLike } from "./attribute.ts";
import { printBlock } from "./block.ts";
import { printElementLike } from "./element.ts";
import { printHTMLNode } from "./html.ts";
import { printRoot } from "./root.ts";
import { printTag } from "./tag.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printTemplateNode(n: SV.TemplateNode, opts: Partial<PrintOptions> = {}): Result<SV.TemplateNode> {
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

export * from "./attribute.ts";
export * from "./block.ts";
export * from "./element.ts";
export * from "./html.ts";
export * from "./tag.ts";
