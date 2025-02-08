/**
 * @import * as JS from "estree";
 * @import { AST as SV } from "svelte/compiler";
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 */

/**
 * @typedef PrintOptions Options for printing defined by user.
 * @prop {Partial<FormatOptions>} [format] - formatting options
 * @prop {Partial<RootOptions>} [root] - Svelte SV node {@link SV.Root} based options
 */

/**
 * Name _(alias)_ for indentation type. This package will automatically determine a desired indent.
 * @typedef {typeof Options.INDENT extends Map<infer K, infer _V> ? K : never} IndentName
 */

/**
 * Provided for building a stable API - gives an space for expansion on future improvements/features.
 *
 * @typedef FormatOptions Options related to formatting.
 * @prop {IndentName} [indent] - defaults to {@link DEFAULT_INDENT}
 */

/**
 * @typedef {Extract<keyof SV.Root, "css" | "fragment" | "instance" | "module" | "options">} RootNode
 */

/**
 * ## Legend
 *
 * - `"options"` - {@link SV.SvelteOptions}
 * - `"module"` - {@link SV.Script}
 * - `"instance"` - {@link SV.Script}
 * - `"fragment"` - {@link SV.Fragment}
 * - `"css"` - {@link SV.CSS.StyleSheet}
 *
 * @typedef {[RootNode, RootNode, RootNode, RootNode, RootNode]} RootOrder Specified order of {@link Root} child SV nodes to print out.
 *
 */

/**
 * @typedef RootOptions Options related to {@link Root} Svelte SV node.
 * @prop {RootOrder} [order] - defaults to {@link DEFAULT_ORDER}
 */

/**
 * @satisfies {RootOrder}
 */
const DEFAULT_ORDER = /** @type {const} */ (["options", "module", "instance", "fragment", "css"]);

/**
 * @internal
 * Give sa a better control on transforming passed options.
 *
 * @template {SvelteOnlyNode | JS.Node} [N=SvelteOnlyNode | JS.Node]
 */
export class Options {
	/**
	 * @satisfies {IndentName}
	 * @readonly
	 */
	static DEFAULT_INDENT = "tab";
	/** @readonly */
	static INDENT = new Map(
		/** @type {const} */ ([
			["tab", "\t"],
			["2-space", "  "],
			["4-space", "    "],
		]),
	);

	/**
	 * @type {PrintOptions} raw options - _(before transformation)_ - for better DX
	 */
	#raw;

	/**
	 * @param {PrintOptions} raw - provided options by user - before transformation
	 */
	constructor(raw) {
		this.#raw = raw;
	}

	/** @returns {typeof Options.INDENT extends Map<infer _K, infer V> ? V : never} */
	get indent() {
		const { format } = this.#raw;
		const transformed = Options.INDENT.get(format?.indent ?? Options.DEFAULT_INDENT);
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
