/**
 * @import { AST as SV } from "svelte/compiler";
 */

import { Wrapper } from "../../_internal/shared.js";

export class OpeningBlock extends Wrapper {
	/** @readonly */
	static START = "{#";
	/** @readonly */
	static END = "}";
}

export class MidBlock extends Wrapper {
	/** @readonly */
	static START = "{:";
	/** @readonly */
	static END = "}";
}

export class ClosingBlock extends Wrapper {
	/** @readonly */
	static START = "{/";
	/** @readonly */
	static END = "}";
}

/**
 * @internal
 * Checks if `alternate` contains `IfBlock` with `{:else if}`
 * @param {SV.IfBlock['alternate']} n
 */
export function get_if_block_alternate(n) {
	return n?.nodes.find((n) => n.type === "IfBlock");
}
