/**
 * @import { AST } from "svelte/compiler";
 *
 * @import { print } from "./mod.js";
 */

/**
 * Options for {@link print} defined by user.
 *
 * @typedef PrintOptions
 * @property {Partial<FormatOptions>} [format] - formatting options
 * @property {Partial<RootOptions>} [root] - Svelte AST node {@link AST.Root} based options
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
 * @property {IndentName} [indent] - defaults to {@link DEFAULT_INDENT}
 * @internal
 */

/**
 * @typedef {Extract<keyof AST.Root, "css" | "fragment" | "instance" | "module" | "options">} RootNode
 * @internal
 */

/**
 * Specified order of {@link Root} child AST nodes to print out.
 *
 * ## Legend
 *
 * - `"options"` - {@link AST.SvelteOptionsRaw}
 * - `"module"` - {@link AST.Script}
 * - `"instance"` - {@link AST.Script}
 * - `"fragment"` - {@link AST.Fragment}
 * - `"css"` - {@link AST.CSS.StyleSheet}
 *
 * @typedef {[RootNode, RootNode, RootNode, RootNode, RootNode]} RootOrder
 * @internal
 */

// TODO: Use generic type parameter, so we use it only when passed node is {@link Root}
/**
 * Options related to {@link Root} Svelte AST node.
 * @typedef RootOptions
 * @property {RootOrder} [order] - defaults to {@link DEFAULT_ORDER}
 * @internal
 */

/**
 * @satisfies {RootOrder}
 * @internal
 */
const DEFAULT_ORDER = /** @type {const} */ (["options", "module", "instance", "fragment", "css"]);

/**
 * This class is for internal use only.
 * Give sa a better control on transforming passed options to the second argument of {@link print}
 *
 * @private
 * @internal
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
	 * @type {PrintOptions} raw options - _(before transformation)_ - for better DX
	 */
	#raw;

	/**
	 * @param {PrintOptions} raw - provided options by user - before transformation
	 */
	constructor(raw) {
		this.#raw = raw;
	}

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
