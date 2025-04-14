import type { AST as SV } from "svelte/compiler";

import { Wrapper } from "../shared.ts";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class OpeningBlock extends Wrapper {
	static override readonly START = "{#";
	static override readonly END = "}";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class MidBlock extends Wrapper {
	static override readonly START = "{:";
	static override readonly END = "}";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class ClosingBlock extends Wrapper {
	static override readonly START = "{/";
	static override readonly END = "}";
}

/**
 * @internal
 * Checks if `alternate` contains `IfBlock` with `{:else if}`
 * @__NO_SIDE_EFFECTS__
 */
export function get_if_block_alternate(n: SV.IfBlock["alternate"]) {
	return n?.nodes.find((n) => n.type === "IfBlock");
}

export function isBlock(n: SV.BaseNode): n is SV.Block {
	return new Set([
		//
		"AwaitBlock",
		"EachBlock",
		"IfBlock",
		"KeyBlock",
		"SnippetBlock",
	]).has(n.type);
}
