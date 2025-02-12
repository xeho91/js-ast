/**
 * @import { AST as SV } from "svelte/compiler";
 */

/**
 * @param {SV.Fragment["nodes"]} nodes
 * @return {boolean}
 * @__NO_SIDE_EFFECTS__
 */
export function has_frag_text_or_exp_tag_only(nodes) {
	for (const ch of nodes) {
		if (ch.type !== "Text" && ch.type !== "ExpressionTag") return false;
	}
	return true;
}
