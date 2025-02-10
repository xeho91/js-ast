/**
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { Options } from "./_option.js";
 */

import * as char from "./_char.js";

/**
 * @internal
 * An instance which can be pushed into collector, and give us a hint to break down the line.
 */
export class Depth {
	/**
	 * Level of the depth for indentation purposes.
	 * @type {number}
	 */
	lvl;

	/**
	 * @param {number} lvl
	 */
	constructor(lvl) {
		this.lvl = lvl;
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
 * @typedef {Depth | Result | string | Wrapper} Piece Values we include in insertion.
 */

/**
 * @typedef {Falsyable<Piece>} RawPiece Pieces with handleable falsy values.
 */

/**
 * @internal
 */
export class Collector {
	/** @type {number} */
	depth = 0;
	/** @type {Piece[]} */
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
		// console.count("append");
		for (const pc of pieces) {
			if (!pc) continue;
			if (Array.isArray(pc)) {
				this.append(...pc);
				continue;
			}
			if (pc instanceof Depth) {
				// ?
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
	 * @param {number} [lvl]
	 * @returns {void}
	 */
	break(lvl = 0) {
		this.depth += lvl;
		this.append(new Depth(this.depth));
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
class Wrapper {
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
	 * @param {Depth} current_depth
	 * @returns {Collector}
	 */
	wrap(current_depth) {
		switch (this.type) {
			case "inline": {
				this.collector.pieces.unshift(/** @type {typeof Wrapper} */ (this.constructor).START);
				this.collector.pieces.push(/** @type {typeof Wrapper} */ (this.constructor).END);
				return this.collector;
			}
			case "mutliline": {
				// console.log({ curr_depth: current_depth });
				const nested_depth = new Depth(current_depth.lvl + 1);
				this.collector.pieces = this.collector.pieces.flatMap((pc, idx, arr) => {
					return idx < arr.length - 1 ? [pc, nested_depth] : [pc];
				});
				this.collector.pieces.unshift(
					//
					/** @type {typeof Wrapper} */ (this.constructor).START,
					nested_depth,
				);
				this.collector.pieces.push(
					//
					new Depth(current_depth.lvl),
					/** @type {typeof Wrapper} */ (this.constructor).END,
				);
				return this.collector;
			}
			case "both": {
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

/**
 * @internal
 */
export class AngleBrackets extends Wrapper {
	/** @readonly */
	static START = "<";
	/** @readonly */
	static END = ">";
}
/**
 * Alias for code readability
 * @internal
 */
export const HTMLOpeningTag = AngleBrackets;
export class HTMLSelfClosingTag extends Wrapper {
	/** @readonly */
	static START = "<";
	/** @readonly */
	static END = "/>";
}
export class HTMLClosingTag extends Wrapper {
	/** @readonly */
	static START = "</";
	/** @readonly */
	static END = ">";
}

/**
 * @internal
 */
export class CurlyBrackets extends Wrapper {
	/** @readonly */
	static START = "{";
	/** @readonly */
	static END = "}";
}

/**
 * @internal
 */
export class RoundBrackets extends Wrapper {
	/** @readonly */
	static START = "(";
	/** @readonly */
	static END = ")";
}

/**
 * @internal
 */
export class SquareBrackets extends Wrapper {
	/** @readonly */
	static START = "[";
	/** @readonly */
	static END = "]";
}

/**
 * @internal
 */
export class DoubleQuotes extends Wrapper {
	/** @readonly */
	static START = '"';
	/** @readonly */
	static END = '"';
}

/**
 * @internal
 * @template {SvelteOnlyNode} [N=SvelteOnlyNode]
 */
export class Result {
	/**
	 * @type {N}
	 */
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
	#latest_line = new Line(new Depth(0));

	/**
	 * @param {Collector} collector
	 * @returns {void}
	 */
	#handle_collector(collector) {
		for (const [idx, pc] of collector) {
			if (pc instanceof Depth) {
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
	 * @param {[number, Depth]} entry
	 * @returns {void}
	 */
	#handle_depth([idx, d]) {
		this.#lines.push(this.#latest_line);
		this.#latest_line = new Line(d);
	}

	/**
	 * @param {[number, Wrapper]} entry
	 * @returns {void}
	 */
	#handle_wrapper([idx, w]) {
		const pcs = w.wrap(this.#latest_line.depth);
		return this.#handle_collector(pcs);
	}

	/**
	 * @param {[number, Result]} entry
	 * @returns {void}
	 */
	#handle_result([idx, r]) {
		this.#handle_collector(r.collector);
	}

	#was_triggered = false;

	/** @return {Line[]} */
	get lines() {
		if (this.#was_triggered) return this.#lines;
		this.#was_triggered = true;
		this.#handle_collector(this.collector);
		this.#lines.push(this.#latest_line);
		return this.#lines;
	}

	/** @returns {string} */
	toString() {
		const lines = this.lines;
		console.log({
			lines: lines.map((l) => ({ depth: l.depth.lvl, output: l.output })),
		});
		return lines.map((ln) => ln.toString(this.opts.indent)).join(char.NL);
	}
}

/**
 * @internal
 */
class Line {
	/**
	 * Determines at which indentation level this line is supposed to be.
	 * @type {Depth}
	 */
	depth;
	/**
	 * Content of line.
	 * @type {string[]}
	 */
	output = [];

	/**
	 * @param {Depth} depth
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
		return indent.repeat(this.depth.lvl) + this.output.join("");
	}
}
