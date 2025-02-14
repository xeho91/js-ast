import type { AST as SV } from "svelte/compiler";

export interface PrintOptions {
	format?: Partial<FormatOptions>;
	root?: Partial<RootOptions>;
}

/**
 * Name _(alias)_ for indentation type. This package will automatically determine a desired indent.
 */
type IndentName = typeof Options.INDENT extends Map<infer K, infer _V> ? K : never;

/**
 * Provided for building a stable API - gives an space for expansion on future improvements/features.
 */
interface FormatOptions {
	indent?: IndentName;
}

type RootNode = Extract<keyof SV.Root, "css" | "fragment" | "instance" | "module" | "options">;

/**
 * ## Legend
 *
 * - `"options"` - {@link SV.SvelteOptions}
 * - `"module"` - {@link SV.Script}
 * - `"instance"` - {@link SV.Script}
 * - `"fragment"` - {@link SV.Fragment}
 * - `"css"` - {@link SV.CSS.StyleSheet}
 */
type RootOrder = [RootNode, RootNode, RootNode, RootNode, RootNode];

/**
 * Options related to {@link Root} Svelte SV node.
 */
interface RootOptions {
	/**
	 * defaults to {@link DEFAULT_ORDER}
	 */
	order?: RootOrder;
}

/**
 * @internal
 * Gives us a better control on transforming passed options.
 */
export class Options {
	static readonly DEFAULT_INDENT = "tab" satisfies IndentName;
	static readonly DEFAULT_ORDER = /** @type {const} */ [
		"options",
		"module",
		"instance",
		"fragment",
		"css",
	] satisfies RootOrder;
	static readonly INDENT = new Map(
		/** @type {const} */ [
			["tab", "\t"],
			["2-space", "  "],
			["4-space", "    "],
		],
	);

	/**
	 * _(before transformation)_ - for better DX
	 */
	#raw: PrintOptions;

	/**
	 * @param raw provided options by user - before transformation
	 */
	constructor(raw: PrintOptions) {
		this.#raw = raw;
	}

	get indent(): typeof Options.INDENT extends Map<infer _K, infer V> ? V : never {
		const { format } = this.#raw;
		const transformed = Options.INDENT.get(format?.indent ?? Options.DEFAULT_INDENT);
		if (!transformed) {
			throw new Error(`Unrecognized indent name - ${format?.indent}, allowed are: ${[...Options.INDENT.keys()]}`);
		}
		return transformed;
	}

	get order(): RootOrder {
		const { root } = this.#raw;
		return root?.order ?? Options.DEFAULT_ORDER;
	}
}
