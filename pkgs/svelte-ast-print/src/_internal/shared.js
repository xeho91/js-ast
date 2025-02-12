/**
 * @import * as JS from "estree";
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./option.js";
 */

import * as char from "./char.js";

import { Options } from "./option.js";

/**
 * @internal
 * State to store our garbage collectible state for node that is being processed for printing.
 * Each function call should generate unique identifier to the passed user options - by default is `{}`.
 * @type {WeakMap<JS.Node | SvelteOnlyNode, State>}
 */
const STORE = new WeakMap();

/**
 * @internal
 * @template {JS.Node | SvelteOnlyNode} [N=JS.Node | SvelteOnlyNode]
 */
export class State {
	/**
	 * Stateful indentation level.
	 * @type {number}
	 */
	static depth = 0;

	/**
	 * @template {JS.Node | SvelteOnlyNode} [N=JS.Node | SvelteOnlyNode]
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
	}

	/**
	 * @param {number} [depth]
	 * @returns {void}
	 */
	break(depth) {
		this.collector.break(depth);
	}

	/**
	 * @param {Parameters<Collector['append']>} pieces
	 */
	add(...pieces) {
		this.collector.append(...pieces);
	}

	/**
	 * @returns {Result<N>}
	 */
	get result() {
		return new Result(this.node, this.opts, this.collector);
	}
}

/**
 * @internal
 * An instance which can be pushed into collector, and give us a hint to break down the line.
 */
class Break {
	/**
	 * Level of the depth for indentation purposes.
	 * @type {number}
	 */
	depth;

	/**
	 * @param {number} depth
	 */
	constructor(depth) {
		this.depth = depth;
	}
}

/**
 * @typedef {false | null | undefined} Falsy Values we can handle and exclude from insertion.
 */

/**
 * @template T
 * @typedef {T | Falsy} Falsyable Unionize a type with handled falsy values.
 */

/**
 * @typedef {Break | Result | string | Wrapper} Piece Values we include in insertion.
 */

/**
 * @typedef {Falsyable<Piece>} RawPiece Pieces with handleable falsy values.
 */

/**
 * @internal
 */
class Collector {
	/**
	 * Collected pieces to be processed later.
	 * @type {Piece[]}
	 */
	pieces = [];
	/**
	 * Collect the total from pieces, for line "length" calculation.
	 * @type {number}
	 */
	length = 0;

	[Symbol.iterator]() {
		return this.pieces.entries();
	}

	/**
	 * @param {...(RawPiece | RawPiece[] | Result)} pieces
	 * @returns {void}
	 */
	append(...pieces) {
		for (const pc of pieces) {
			if (!pc) continue;
			if (Array.isArray(pc)) {
				this.append(...pc);
				continue;
			}
			if (pc instanceof Break) {
				// Do nothing?
			}
			if (pc instanceof Result) {
				this.length += pc.collector.length;
			}
			if (typeof pc === "string") {
				this.length += pc.length;
			}
			if (pc instanceof Wrapper) {
				this.length += pc.size;
			}
			this.pieces.push(pc);
		}
	}

	/**
	 * @param {number} [depth]
	 * @returns {void}
	 */
	break(depth = 0) {
		State.depth += depth;
		this.append(new Break(State.depth));
	}
}

/**
 * @internal
 * @lintignore
 * @template {JS.Node | SvelteOnlyNode} [N=JS.Node | SvelteOnlyNode]
 */
export class Result {
	/** @type {N} */
	node;
	/** @type {Options} */
	opts;
	/** @type {Collector} */
	collector;

	/**
	 * @param {N} node
	 * @param {Options} opts
	 * @param {Collector} collector
	 */
	constructor(node, opts, collector) {
		this.node = node;
		this.opts = opts;
		this.collector = collector;
	}

	/** @type {Line[]} */
	#lines = [];
	#latest_line = new Line(0);
	#latest_depth = 0;

	/**
	 * @param {Collector} collector
	 * @returns {void}
	 */
	#handle_collector(collector) {
		for (const [idx, pc] of collector) {
			if (pc instanceof Break) {
				this.#latest_depth = pc.depth;
				this.#handle_depth([idx, pc]);
				continue;
			}
			if (pc instanceof Result) {
				this.#handle_result([idx, pc]);
				continue;
			}
			if (pc instanceof Wrapper) {
				this.#handle_wrapper([idx, pc]);
				continue;
			}
			// TODO: Will probably have to handle string output from `esrap` - break into lines
			this.#latest_line.output.push(pc);
		}
	}

	/**
	 * @param {[number, Break]} entry
	 * @returns {void}
	 */
	#handle_depth([_idx, d]) {
		this.#lines.push(this.#latest_line);
		this.#latest_line = new Line(d.depth);
	}

	/**
	 * @param {[number, Wrapper]} entry
	 * @returns {void}
	 */
	#handle_wrapper([_idx, w]) {
		const pcs = w.unwrap(this.#latest_depth);
		return this.#handle_collector(pcs);
	}

	/**
	 * @param {[number, Result]} entry
	 * @returns {void}
	 */
	#handle_result([_idx, r]) {
		this.#handle_collector(r.collector);
	}

	#cached = false;

	/** @return {Line[]} */
	get lines() {
		if (this.#cached) return this.#lines;
		this.#cached = true;
		this.#handle_collector(this.collector);
		this.#lines.push(this.#latest_line);
		return this.#lines;
	}

	/** @returns {string} */
	get code() {
		return this.lines.map((ln) => ln.toString(this.opts.indent)).join(char.NL);
	}
}

/**
 * @internal
 */
class Line {
	/**
	 * Determines at which indentation level this line is supposed to be.
	 * @type {number}
	 */
	depth;
	/**
	 * Content of line.
	 * @type {string[]}
	 */
	output = [];

	/**
	 * @param {number} depth
	 * @param {...string[]} output
	 * */
	constructor(depth, ...output) {
		this.depth = depth;
		for (const o of output) this.output.push(...o);
	}

	/**
	 * @param {string} indent
	 * @returns {string}
	 */
	toString(indent) {
		return indent.repeat(this.depth) + this.output.join("");
	}
}

/**
 * ## Legend
 *
 * - `"inline"` - prevent from making it mutliline
 * - `"mutliline"` - prevent from making it inlined
 * - `"both"` - allow both -> will go mutliline when exceeding set max line length
 *
 * @typedef {"inline" | "mutliline" | "both"} WrapperType Determines wrapper behavior.
 */

/**
 * @internal
 *
 * @abstract
 * @template {WrapperType} [T=WrapperType]
 */
export class Wrapper {
	/**
	 * @type {string}
	 * @abstract
	 */
	static START;
	/**
	 * @type {string}
	 * @abstract
	 */
	static END;

	/** @type {Collector} */
	collector = new Collector();
	/** @type {T} */
	type;

	/**
	 * @param {T} type
	 * @param {Parameters<Collector['append']>} pieces
	 */
	constructor(type, ...pieces) {
		this.type = type;
		this.collector.append(...pieces);
	}

	/**
	 * @returns {number}
	 */
	get size() {
		// NOTE: Include brackets start/end - hence `+ 2`
		return this.collector.length + 2;
	}

	/**
	 * @param {Parameters<Collector['append']>} pieces
	 * @returns {void}
	 */
	insert(...pieces) {
		this.collector.append(...pieces);
	}

	/**
	 * @param {number} latest_depth
	 * @returns {Collector}
	 */
	unwrap(latest_depth) {
		switch (this.type) {
			case "inline": {
				this.collector.pieces.unshift(/** @type {typeof Wrapper} */ (this.constructor).START);
				this.collector.pieces.push(/** @type {typeof Wrapper} */ (this.constructor).END);
				return this.collector;
			}
			case "mutliline": {
				this.collector.pieces = this.collector.pieces.flatMap((pc, idx, arr) => {
					return idx < arr.length - 1 ? [pc, new Break(latest_depth + 1)] : [pc];
				});
				this.collector.pieces.unshift(
					//
					/** @type {typeof Wrapper} */ (this.constructor).START,
					new Break(latest_depth + 1),
				);
				this.collector.pieces.push(
					//
					new Break(latest_depth),
					/** @type {typeof Wrapper} */ (this.constructor).END,
				);
				return this.collector;
			}
			case "both": {
				// TODO: Handle when there's a feature of line breaking when line length is exceeded.
				this.collector.pieces.unshift(/** @type {typeof Wrapper} */ (this.constructor).START);
				this.collector.pieces.push(/** @type {typeof Wrapper} */ (this.constructor).END);
				return this.collector;
			}
			default: {
				throw new TypeError(`Unrecognized wrapper type: ${this.type}`);
			}
		}
	}
}
