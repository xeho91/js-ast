import type * as JS from "estree";
import * as compiler from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

import type { SvelteOnlyNode } from "../src/node.js";

type Node = SvelteOnlyNode | JS.Node;

export function parse_and_extract<N extends Node>(code: string, name: N["type"]): N {
	const parsed = parse<N>(code);
	return extract(parsed, name);
}

function parse<N extends Node>(code: string): N {
	return compiler.parse(code, { modern: true }) as unknown as N;
}

function extract<N extends Node>(parsed: N, name: N["type"]): N {
	interface State {
		target: N | undefined;
	}
	const state: State = { target: undefined };
	walk(
		parsed,
		state,
		// @ts-expect-error: WARN: Too lazy to type
		{
			[name](node: N, ctx: Context<Node, State>) {
				ctx.state.target = node;
				ctx.stop();
			},
		},
	);
	if (!state.target) {
		throw new Error(`Could not find the in the parsed Svelte AST a target node: ${name}`);
	}
	return state.target;
}
