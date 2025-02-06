import dedent from "dedent";
import { parse as svelte_parse } from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

import type { Node } from "../src/node.js";

export function parse(code: string): Node {
	return svelte_parse(code, { modern: true }) as Node;
}

export function extract<T extends Node>(parsed: Node, name: T["type"]): T {
	const results: {
		target: T | undefined;
	} = {
		target: undefined,
	};

	walk(parsed, results, {
		[name](node: T, context: Context<Node, typeof results>) {
			const { state, stop } = context;
			state.target = node;
			stop();
		},
	});

	if (!results.target) {
		throw new Error(`Could not find the in the parsed Svelte AST a target node: ${name}`);
	}

	return results.target;
}

export function parse_and_extract<T extends Node>(code: string, name: T["type"]): T {
	const parsed = parse(dedent(code));
	return extract(parsed, name);
}
