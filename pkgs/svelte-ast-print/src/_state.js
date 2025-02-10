/**
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { Options } from "./_option.js";
import { Collector, Result } from "./_result.js";

/**
 * @internal
 * State to store our garbage collectible state for node that is being processed for printing.
 * Each function call should generate unique identifier to the passed user options - by default is `{}`.
 * @type {WeakMap<SvelteOnlyNode, State>}
 */
const STORE = new WeakMap();

/**
 * @internal
 * @template {SvelteOnlyNode} [N=SvelteOnlyNode]
 */
export class State {
	/**
	 * @template {SvelteOnlyNode} [N=SvelteOnlyNode]
	 * @param {N} n
	 * @param {Partial<PrintOptions>} opts
	 * @returns {State<N>}
	 */
	static get(n, opts) {
		if (!STORE.has(n)) STORE.set(n, new State(n, opts));
		const state = STORE.get(n);
		if (!state) throw new Error("Unreachable state");
		return /** @type {State<N>} */ (state);
	}

	/**
	 * @type {N}
	 */
	node;
	/**
	 * @type {Collector}
	 */
	collector = new Collector();
	/**
	 * Transformed options.
	 * @type {Options}
	 */
	opts;

	/**
	 * @param {N} n
	 * @param {Partial<PrintOptions>} opts
	 * @private
	 */
	constructor(n, opts) {
		if (new.target !== State) throw new Error("Unreachable, attempted to access private constructor.");
		this.opts = new Options(opts);
		this.node = n;
		this.collector = new Collector();
		// new Proxy(
		// 	{ current: n },
		// 	{
		// 		get: (t, prop, rec) => {
		// 			if (prop === "current") return t.current;
		// 			return Reflect.get(t, prop, rec);
		// 		},
		// 		set: (t, prop, val, rec) => {
		// 			if (prop === "current") {
		// 				t.current = val;
		// 				// console.log("processing", n);
		// 				return true;
		// 			}
		// 			return Reflect.set(t, prop, val, rec);
		// 		},
		// 	},
		// );
		// this.#collectors.set(n, new Collector());
	}

	// /**
	//  * @returns {Collector}
	//  */
	// get collector() {
	// 	// console.log(
	// 	// 	"RESULTS",
	// 	// 	util.inspect(this.#collectors, {
	// 	// 		showHidden: true,
	// 	// 	}),
	// 	// );
	// 	console.log(
	// 		"COLLECTORS",
	// 		util.inspect(this.#collectors, {
	// 			showHidden: true,
	// 		}),
	// 	);
	// 	// console.count("collector");
	// 	const stored = this.#collectors.get(this.node.current);
	// 	if (!stored) throw new Error("Unreachable, collector wasn't created for this node");
	// 	return stored;
	// }

	// /** @returns {number} */
	// get depth() {
	// 	return this.collector.depth;
	// }

	/**
	 * @param {number} [lvl]
	 * @returns {void}
	 */
	break(lvl = 0) {
		this.collector.break(lvl);
	}

	/**
	 * @param {Parameters<Collector['append']>} pieces
	 */
	add(...pieces) {
		this.collector.append(...pieces);
	}

	/** @returns {Result<N>} */
	get result() {
		return new Result(this.node, this.opts, this.collector);
	}
}
