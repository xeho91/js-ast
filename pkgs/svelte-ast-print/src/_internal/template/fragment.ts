import type { AST as SV } from "svelte/compiler";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export function has_frag_text_or_exp_tag_only(nodes: SV.Fragment["nodes"]): boolean {
	for (const ch of nodes) {
		if (ch.type !== "Text" && ch.type !== "ExpressionTag") return false;
	}
	return true;
}
