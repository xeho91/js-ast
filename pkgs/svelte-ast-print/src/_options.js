/**
 * @import * as JS from "estree";
 * @import { AST as SV } from "svelte/compiler";
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { print } from "./mod.js";
 */

/**
 * Options for {@link print} defined by user.
 *
 * @template {SvelteOnlyNode | JS.Node} [N=SvelteOnlyNode | JS.Node]
 * @typedef PrintOptions
 * @prop {Partial<FormatOptions>} [format] - formatting options
 * @prop {N extends SV.Root ? Partial<RootOptions> : never} [root] - Svelte SV node {@link SV.Root} based options
 * @internal
 */

/**
 * Name _(alias)_ for indentation type. This package will automatically determine a desired indent.
 * @typedef {typeof Options.INDENT extends Map<infer K, infer _V> ? K : never} IndentName
 * @internal
 */

/**
 * @satisfies {IndentName}
 * @internal
 */
const DEFAULT_INDENT = "tab";

/**
 * Options related to formatting.
 * Provided for building a stable API - gives an space for expansion on future improvements/features.
 *
 * @typedef FormatOptions
 * @prop {IndentName} [indent] - defaults to {@link DEFAULT_INDENT}
 * @internal
 */

/**
 * @typedef {Extract<keyof SV.Root, "css" | "fragment" | "instance" | "module" | "options">} RootNode
 * @internal
 */

/**
 * Specified order of {@link Root} child SV nodes to print out.
 *
 * ## Legend
 *
 * - `"options"` - {@link SV.SvelteOptions}
 * - `"module"` - {@link SV.Script}
 * - `"instance"` - {@link SV.Script}
 * - `"fragment"` - {@link SV.Fragment}
 * - `"css"` - {@link SV.CSS.StyleSheet}
 *
 * @typedef {[RootNode, RootNode, RootNode, RootNode, RootNode]} RootOrder
 * @internal
 */

/**
 * @internal
 * Options related to {@link Root} Svelte SV node.
 * @typedef RootOptions
 * @prop {RootOrder} [order] - defaults to {@link DEFAULT_ORDER}
 */

/**
 * @satisfies {RootOrder}
 * @internal
 */
const DEFAULT_ORDER = /** @type {const} */ (["options", "module", "instance", "fragment", "css"]);

/**
 * This class is for internal use only.
 * Give sa a better control on transforming passed options to the second argument of {@link print}.
 *
 * @internal
 * @template {SvelteOnlyNode | JS.Node} [N=SvelteOnlyNode | JS.Node]
 */
export class Options {
	static INDENT = new Map(
		/** @type {const} */ ([
			["tab", "\t"],
			["2-space", "  "],
			["4-space", "    "],
		]),
	);

	/**
	 * @type {PrintOptions<N>} raw options - _(before transformation)_ - for better DX
	 */
	#raw;

	/**
	 * @param {PrintOptions<N>} raw - provided options by user - before transformation
	 */
	constructor(raw) {
		this.#raw = raw;
	}

	/** @returns {typeof Options.INDENT extends Map<infer _K, infer V> ? V : never} */
	get indent() {
		const { format } = this.#raw;
		const transformed = Options.INDENT.get(format?.indent ?? DEFAULT_INDENT);
		if (!transformed) {
			throw new Error(`Unrecognized indent name - ${format?.indent}, allowed are: ${[...Options.INDENT.keys()]}`);
		}
		return transformed;
	}

	/** @type {RootOrder} */
	get order() {
		const { root } = this.#raw;
		return root?.order ?? DEFAULT_ORDER;
	}
}
