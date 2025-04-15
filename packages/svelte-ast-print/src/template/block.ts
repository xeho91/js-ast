/**
 * Printers related to Svelte **block**-related AST nodes only.
 * @module svelte-ast-print/template/block
 */

import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import { print_js } from "../_internal/js.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import { ClosingBlock, get_if_block_alternate, MidBlock, OpeningBlock } from "../_internal/template/block.js";
import { RoundBrackets } from "../_internal/wrapper.js";
import { printFragment } from "../fragment.ts";

/**
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printBlock(n: SV.Block, opts: Partial<PrintOptions> = {}): Result<SV.Block> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "AwaitBlock": return printAwaitBlock(n, opts);
		case "EachBlock": return printEachBlock(n, opts);
		case "IfBlock": return printIfBlock(n, opts);
		case "KeyBlock": return printKeyBlock(n, opts);
		case "SnippetBlock": return printSnippetBlock(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte/await}
 *
 * @example standard
 * ```svelte
 * {#await expression}...{:then name}...{:catch name}...{/await}
 * ```
 *
 * @example without catch
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example without pending body
 * ```svelte
 * {#await expression then name}...{/await}
 * ```
 *
 * @example with catch body only
 * ```svelte
 * {#await expression catch name}...{/await}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printAwaitBlock(n: SV.AwaitBlock, opts: Partial<PrintOptions> = {}): Result<SV.AwaitBlock> {
	const name = "await";
	const st = State.get(n, opts);
	const opening = new OpeningBlock(
		//
		"inline",
		name,
		char.SPACE,
		print_js(n.expression, st.opts),
	);
	if (n.then && !n.pending) opening.insert(char.SPACE, "then", n.value && [char.SPACE, print_js(n.value, st.opts)]);
	if (n.catch && !n.pending) opening.insert(char.SPACE, "catch", n.error && [char.SPACE, print_js(n.error, st.opts)]);
	st.add(opening);
	if (n.pending) {
		st.break(+1);
		st.add(printFragment(n.pending, opts));
		st.break(-1);
	}
	if (n.then) {
		if (n.value && n.pending) {
			st.add(new MidBlock("inline", "then", n.value && [char.SPACE, print_js(n.value, st.opts)]));
		}
		st.break(+1);
		st.add(printFragment(n.then, opts));
		st.break(-1);
	}
	if (n.catch) {
		if (n.error && n.pending) {
			st.add(new MidBlock("inline", "catch", n.error && [char.SPACE, print_js(n.error, st.opts)]));
		}
		st.break(+1);
		st.add(printFragment(n.catch, opts));
		st.break(-1);
	}
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/each}
 *
 * @example simple
 * ```svelte
 * {#each expression as name}...{/each}
 * ```
 *
 * @example without "as" item
 * ```svelte
 * {#each expression}...{/each}
 * ```
 *
 * @example without "as" item, but with index
 * ```svelte
 * {#each expression, index}...{/each}
 * ```
 *
 * @example with index
 * ```svelte
 * {#each expression as name, index}...{/each}
 * ```
 *
 * @example keyed
 * ```svelte
 * {#each expression as name (key)}...{/each}
 * ```
 *
 * @example with index and keyed
 * ```svelte
 * {#each expression as name, index (key)}...{/each}
 * ```
 *
 * @example with else clause for when list is empty
 * ```svelte
 * {#each expression as name}...{:else}...{/each}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printEachBlock(n: SV.EachBlock, opts: Partial<PrintOptions> = {}): Result<SV.EachBlock> {
	const name = "each";
	const st = State.get(n, opts);
	st.add(
		new OpeningBlock(
			//
			"inline",
			name,
			char.SPACE,
			print_js(n.expression, st.opts),
			n.context && [char.SPACE, "as", char.SPACE, print_js(n.context, st.opts)],
			n.index && [char.COMMA, char.SPACE, n.index],
			n.key && [char.SPACE, new RoundBrackets("inline", print_js(n.key, st.opts))],
		),
	);
	st.break(+1);
	st.add(printFragment(n.body, opts));
	st.break(-1);
	if (n.fallback) {
		st.add(new MidBlock("inline", "else"));
		st.break(+1);
		st.add(printFragment(n.fallback, opts));
		st.break(-1);
	}
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/if}
 *
 * @example simple
 * ```svelte
 * {#if expression}...{/if}
 * ```
 *
 * @example with else if
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example with else
 * ```svelte
 * {#if expression}...{:else}...{/if}
 * ```
 *
 * @example with else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else}...{/if}
 * ```
 *
 * @example with multiple else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else if expression}...{:else}...{/if}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printIfBlock(n: SV.IfBlock, opts: Partial<PrintOptions> = {}): Result<SV.IfBlock> {
	const name = "if";
	const st = State.get(n, opts);
	if (!n.elseif) {
		st.add(new OpeningBlock("inline", name, char.SPACE, print_js(n.test, st.opts)));
	} else {
		st.add(new MidBlock("inline", "else if", char.SPACE, print_js(n.test, st.opts)));
	}
	st.break(+1);
	st.add(printFragment(n.consequent, opts));
	st.break(-1);
	const alternate_if_block = get_if_block_alternate(n.alternate);
	if (n.alternate) {
		if (alternate_if_block) st.add(printIfBlock(alternate_if_block, opts));
		else {
			st.add(new MidBlock("inline", "else"));
			st.break(+1);
			st.add(printFragment(n.alternate, opts));
			st.break(-1);
		}
	}
	if (!alternate_if_block) st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/key}
 *
 * @example pattern
 * ```svelte
 * {#key expression}...{/key}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printKeyBlock(n: SV.KeyBlock, opts: Partial<PrintOptions> = {}): Result<SV.KeyBlock> {
	const name = "key";
	const st = State.get(n, opts);
	st.add(new OpeningBlock("inline", name, char.SPACE, print_js(n.expression, st.opts)));
	st.break(+1);
	st.add(printFragment(n.fragment, opts));
	st.break(-1);
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 *
 * @see {@link https://svelte.dev/docs/svelte/snippet}
 *
 * @example pattern
 * ```svelte
 * {#snippet expression(parameters)}...{/snippet}
 * ```
 *
 * @since 1.0.0
 * @__NO_SIDE_EFFECTS__
 */
export function printSnippetBlock(n: SV.SnippetBlock, opts: Partial<PrintOptions> = {}): Result<SV.SnippetBlock> {
	const name = "snippet";
	const st = State.get(n, opts);
	const opening = new OpeningBlock(
		//
		"inline",
		name,
		char.SPACE,
		print_js(n.expression, st.opts),
	);
	const params_bracket = new RoundBrackets("inline");
	for (const [idx, p] of n.parameters.entries()) {
		if (idx > 0) params_bracket.insert(char.COMMA, char.SPACE);
		params_bracket.insert(print_js(p, st.opts));
	}
	opening.insert(params_bracket);
	st.add(opening);
	st.break(+1);
	st.add(printFragment(n.body, opts));
	st.break(-1);
	st.add(new ClosingBlock("inline", name));
	return st.result;
}
