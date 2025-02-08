/**
 * @import { SvelteOnlyNode } from "svelte-ast-build";
 *
 * @import { PrintOptions } from "./_option.js";
 */

import { Options } from "./_option.js";

/** @typedef {number} Depth */

/** @typedef {false | null | undefined} Falsy */
/**
 * @template T
 * @typedef {T | false | null | undefined} Falsyable
 */
/** @typedef {Falsyable<string | Result> | Falsyable<string | Result>[]} Pieces */

/** Space character */
export const SP = " ";
/** New line */
export const NL = "\n";

/**
 * @internal
 * @template {SvelteOnlyNode} [N=SvelteOnlyNode]
 */
export class Result {
	/** @type {N} */
	node;
	/** @type {number} */
	depth = 0;
	/** @type {Options<N>} */
	opts;
	/** @type {Line[]} */
	lns = [];

	/**
	 * @param {N} node
	 * @param {PrintOptions} [opts]
	 */
	constructor(node, opts = {}) {
		this.node = node;
		this.opts = new Options(opts);
	}

	/**
	 * @param {...Pieces} v
	 * @returns {Line}
	 */
	create_ln(...v) {
		return new Line(this.depth, ...v);
	}

	/**
	 * @param {Line} ln
	 * @returns {void}
	 */
	add_ln(ln) {
		this.lns.push(ln);
	}

	/**
	 * @param {...Pieces} pcs
	 * @returns {void}
	 */
	add_ln_with_pcs(...pcs) {
		this.add_ln(this.create_ln(...pcs));
	}

	/** @returns {string} */
	get indent() {
		return this.opts.indent.repeat(this.depth);
	}

	/** @returns {string} */
	toString() {
		return this.lns.map((ln) => ln.toString(this.opts.indent)).join(NL);
	}
}

/**
 * @internal
 */
export class Line {
	/** @type {Depth} */
	#depth;
	/** @type {string[]} */
	#ln = [];

	/**
	 * @param {Depth} depth
	 * @param {...Pieces} pcs
	 * */
	constructor(depth, ...pcs) {
		this.#depth = depth;
		this.add(...pcs);
	}

	/** @param {...Pieces} pcs */
	add(...pcs) {
		for (const p of pcs) {
			if (Array.isArray(p)) {
				this.add(...p);
				continue;
			}
			if (p) this.#ln.push(p.toString());
		}
	}

	/**
	 * @param {string} [indent]
	 * @returns {string}
	 */
	toString(indent = "\t") {
		return indent.repeat(this.#depth) + this.#ln.join("");
	}
}
