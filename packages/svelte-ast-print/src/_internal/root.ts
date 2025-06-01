import type { AST as SV } from "svelte/compiler";

export function clean_whitespace_in_fragment(n: SV.Fragment): SV.Fragment {
	while (n.nodes.length > 0) {
		const first = n.nodes[0];
		if (first?.type !== "Text") break;
		if (!/^[\s]+$/.test(first.data)) break;
		n.nodes.shift();
	}
	while (n.nodes.length > 0) {
		const last = n.nodes[n.nodes.length - 1];
		if (last?.type !== "Text") break;
		if (!/^[\s]+$/.test(last.data)) break;
		n.nodes.pop();
	}
	if (n.nodes[0]?.type === "Text") {
		const content = n.nodes[0].data.replace(/^[\s]+(?=\w)/, "");
		n.nodes[0] = {
			...n.nodes[0],
			data: content,
			raw: content,
		};
	}
	return n;
}
