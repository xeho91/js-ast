import type * as JS from "estree";
import * as compiler from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

type Node = compiler.AST.SvelteNode | compiler.AST.Root | compiler.AST.Script | JS.Node;

export function parse_and_extract<N extends Node>(code: string, name: N["type"]): N {
	const parsed = parse<N>(code);
	return extract(parsed, name);
}

function parse<N extends Node>(code: string): N {
	return compiler.parse(code, { modern: true, loose: true }) as unknown as N;
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
			[name](node: N, ctx: Context<N, State>) {
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
