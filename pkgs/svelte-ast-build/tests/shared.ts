import type * as JS from "estree";
import * as compiler from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

import type { SvelteOnlyNode } from "../src/svelte.js";

export function parse_and_extract<T extends SvelteOnlyNode | JS.BaseNode>(code: string, name: T["type"]): T {
	const parsed = parse<T>(code);
	return extract(parsed, name);
}

function parse<T extends SvelteOnlyNode | JS.BaseNode>(code: string): T {
	return compiler.parse(code, { modern: true }) as unknown as T;
}

function extract<T extends SvelteOnlyNode | JS.BaseNode>(parsed: T, name: T["type"]): T {
	interface State {
		target: T | undefined;
	}
	const state: State = { target: undefined };
	walk(
		parsed,
		state,
		// @ts-expect-error: WARN: Too lazy to type
		{
			[name](node: T, ctx: Context<Node, State>) {
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
