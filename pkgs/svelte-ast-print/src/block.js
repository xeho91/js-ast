/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { print as print_js } from "esrap";

import { Result, SP } from "./_result.js";
import { printFragment } from "./fragment.js";

/**
 * @param {SV.Block} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Block>}
 * @__NO_SIDE_EFFECTS__
 */
export function printBlock(n, opts) {
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
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
const BLOCK = /** @type {const} */ ({
	START: "{",
	END: "}",
	OPEN: "#",
	MID: "",
	CLOSE: "/",
	/**
	 * @internal
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof BLOCK.START}${typeof BLOCK.OPEN}${T}`}
	 */
	open: (name) => `${BLOCK.START}${BLOCK.OPEN}${name}`,
	/**
	 * @internal
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof BLOCK.START}${typeof BLOCK.MID}${T}`}
	 */
	mid: (name) => `${BLOCK.START}${BLOCK.MID}${name}`,
	/**
	 * @internal
	 * @template {string} T
	 * @param {T} name
	 * @return {`${typeof BLOCK.START}${typeof BLOCK.CLOSE}${T}${typeof BLOCK.END}`}
	 */
	close: (name) => `${BLOCK.START}${BLOCK.CLOSE}${name}${BLOCK.END}`,
});

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
 * @param {SV.AwaitBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AwaitBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAwaitBlock(n, opts) {
	const name = "await";
	const res = new Result(n, opts);
	const opening = res.create_ln(BLOCK.open(name), SP, print_js(n.expression).code);
	if (n.then && !n.pending) opening.add(SP, "then", n.value && [SP, print_js(n.value).code]);
	if (n.catch && !n.pending) opening.add(SP, "catch", n.error && [SP, print_js(n.error).code]);
	opening.add(BLOCK.END);
	res.add_ln(opening);
	if (n.pending) {
		res.depth++;
		res.create_ln(printFragment(n.pending, opts));
		res.depth--;
	}
	if (n.then) {
		if (n.pending) res.add_ln_with_pcs(BLOCK.mid("then"), n.value && [SP, print_js(n.value).code], BLOCK.END);
		res.depth++;
		res.add_ln_with_pcs(printFragment(n.then, opts));
		res.depth--;
	}
	if (n.catch) {
		if (n.pending) res.add_ln_with_pcs(BLOCK.mid("catch"), n.error && [SP, print_js(n.error).code], BLOCK.END);
		res.depth++;
		res.add_ln_with_pcs(printFragment(n.catch, opts));
		res.depth--;
	}
	res.add_ln_with_pcs(BLOCK.close(name));
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/each}
 *
 * @example simple
 * ```svelte
 * {#each expression as name}...{/each}
 * ```
 *
 * @example without `as` item
 * ```svelte
 * {#each expression}...{/each}
 * ```
 *
 * @example without `as` item, but with index
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
 * @param {SV.EachBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.EachBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printEachBlock(n, opts) {
	const name = "each";
	const res = new Result(n, opts);
	const opening = res.create_ln(BLOCK.open(name), SP, print_js(n.expression).code);
	if (n.context) opening.add(SP, "as", SP, print_js(n.context).code);
	if (n.index) opening.add(",", SP, n.index);
	if (n.key) opening.add(SP, "(", print_js(n.key).code, ")");
	opening.add(BLOCK.END);
	res.add_ln(opening);
	res.depth++;
	res.add_ln_with_pcs(printFragment(n.body, opts));
	res.depth--;
	if (n.fallback) {
		res.add_ln_with_pcs(BLOCK.mid("else"), BLOCK.END);
		res.depth++;
		res.add_ln_with_pcs(printFragment(n.fallback, opts));
		res.depth--;
	}
	res.add_ln_with_pcs(BLOCK.close(name));
	return res;
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
 * @param {SV.IfBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.IfBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printIfBlock(n, opts) {
	const name = "if";
	const res = new Result(n, opts);
	if (!n.elseif) {
		res.add_ln_with_pcs(BLOCK.open(name), SP, print_js(n.test).code, BLOCK.END);
	} else {
		// res.depth--;
		res.add_ln_with_pcs(BLOCK.mid("else if"), SP, print_js(n.test).code, BLOCK.END);
	}
	res.depth++;
	res.add_ln_with_pcs(printFragment(n.consequent, opts));
	res.depth--;
	const alternate_if_block = get_alternate_if_block(n.alternate);
	if (n.alternate) {
		if (alternate_if_block) res.add_ln_with_pcs(printIfBlock(alternate_if_block, opts));
		else {
			res.add_ln_with_pcs(BLOCK.mid("else"), SP, print_js(n.test).code, BLOCK.END);
			res.depth++;
			res.add_ln_with_pcs(printFragment(n.alternate, opts));
			res.depth--;
		}
	}
	if (!alternate_if_block) res.add_ln_with_pcs(BLOCK.close(name));
	return res;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/key}
 *
 * @example pattern
 * ```svelte
 * {#key expression}...{/key}
 * ```
 *
 * @param {SV.KeyBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.KeyBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printKeyBlock(n, opts) {
	const name = "key";
	const res = new Result(n, opts);
	res.add_ln_with_pcs(BLOCK.open(name), print_js(n.expression).code, BLOCK.END);
	res.depth++;
	res.add_ln_with_pcs(printFragment(n.fragment, opts));
	res.depth--;
	res.add_ln_with_pcs(BLOCK.close(name));
	return res;
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
 * @param {SV.SnippetBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SnippetBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSnippetBlock(n, opts) {
	const name = "snippet";
	const res = new Result(n, opts);
	const opening = res.create_ln(BLOCK.open(name), print_js(n.expression).code);
	opening.add(
		//
		"(",
		n.parameters.map((p) => print_js(p).code).join(", "),
		")",
		BLOCK.END,
	);
	res.depth++;
	res.add_ln_with_pcs(printFragment(n.body, opts));
	res.depth--;
	res.add_ln_with_pcs(BLOCK.close(name));
	return res;
}

/**
 * @internal
 * Checks if `alternate` contains `IfBlock` with `{:else if}`
 * @param {SV.IfBlock['alternate']} n
 */
function get_alternate_if_block(n) {
	return n?.nodes.find((n) => n.type === "IfBlock");
}
