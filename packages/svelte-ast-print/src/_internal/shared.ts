import type * as JS from "estree";
import type { AST as SV } from "svelte/compiler";

import * as char from "./char.ts";
import { Options, type PrintOptions } from "./option.ts";
import type { Node, SvelteOnlyNode } from "./type.ts";

export function isSvelteOnlyNode(n: JS.BaseNode | SV.BaseNode): n is SvelteOnlyNode {
	return new Set([
		// Attribute-like
		"Attribute",
		"SpreadAttribute",
		/// Directives
		"AnimateDirective",
		"BindDirective",
		"ClassDirective",
		"LetDirective",
		"OnDirective",
		"StyleDirective",
		"TransitionDirective",
		"UseDirective",
		// Block
		"EachBlock",
		"IfBlock",
		"AwaitBlock",
		"KeyBlock",
		"SnippetBlock",
		// CSS
		"StyleSheet",
		"Rule",
		"Atrule",
		"SelectorList",
		"Block",
		"ComplexSelector",
		"RelativeSelector",
		"Combinator",
		"TypeSelector",
		"IdSelector",
		"ClassSelector",
		"AttributeSelector",
		"PseudoElementSelector",
		"PseudoClassSelector",
		"Percentage",
		"Nth",
		"NestingSelector",
		"Declaration",
		// Element-like
		"Component",
		"TitleElement",
		"SlotElement",
		"RegularElement",
		"SvelteBody",
		"SvelteBoundary",
		"SvelteComponent",
		"SvelteDocument",
		"SvelteElement",
		"SvelteFragment",
		"SvelteHead",
		"SvelteOptionsRaw",
		"SvelteSelf",
		"SvelteWindow",
		//
		"Fragment",
		// HTML-node
		"Comment",
		"Text",
		//
		"Root",
		"Script",
		// Tag
		"ExpressionTag",
		"HtmlTag",
		"ConstTag",
		"DebugTag",
		"RenderTag",
	]).has(n.type);
}

/**
 * @internal
 * Storage to store our garbage collectible state for node that is being processed for printing.
 * Each function call should generate unique identifier to the passed user options - by default is `{}`.
 */
const STORE = new WeakMap<Node, State>();

/**
 * @internal
 */
export class State<N extends Node = Node> {
	/**
	 * Stateful indentation depth level.
	 */
	static depth = 0;

	static get<N extends Node = Node>(n: N, opts: Partial<PrintOptions>): State<N> {
		if (!STORE.has(n)) STORE.set(n, new State(n, opts));
		const state = STORE.get(n);
		if (!state) throw new Error("Unreachable state");
		return state as State<N>;
	}

	node: N;
	collector = new Collector();
	/**
	 * Transformed options.
	 */
	opts: Options;

	private constructor(n: N, opts: Partial<PrintOptions>) {
		if (new.target !== State) throw new Error("Unreachable, attempted to access private constructor.");
		this.opts = new Options(opts);
		this.node = n;
		this.collector = new Collector();
	}

	break(depth?: number): void {
		this.collector.break(depth);
	}

	add(...pieces: Parameters<Collector["append"]>) {
		this.collector.append(...pieces);
	}

	get result(): Result<N> {
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
	depth: number;

	/**
	 * @param {number} depth
	 */
	constructor(depth: number) {
		this.depth = depth;
	}
}

type Falsy = false | null | undefined;
type Falsyable<T> = T | Falsy;
type Piece = Break | Result | string | Wrapper;
type RawPiece = Falsyable<Piece>;

/**
 * @internal
 */
class Collector {
	/**
	 * Collected pieces to be processed later.
	 */
	pieces: Piece[] = [];
	/**
	 * Collect the total from pieces, for line "length" calculation.
	 */
	length = 0;

	[Symbol.iterator]() {
		return this.pieces.entries();
	}

	append(...pieces: (RawPiece | RawPiece[] | Result)[]): void {
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

	break(depth = 0): void {
		State.depth += depth;
		this.append(new Break(State.depth));
	}
}

/**
 * Instance with the result of printing _(serializing)_ AST {@link Node}.
 */
export class Result<N extends Node = Node> {
	node: N;
	/**
	 * @internal
	 */
	opts: Options;
	/**
	 * @internal
	 */
	collector: Collector;

	/**
	 * @internal
	 */
	constructor(node: N, opts: Options, collector: Collector) {
		this.node = node;
		this.opts = opts;
		this.collector = collector;
	}

	#lines: Line[] = [];
	#latest_line = new Line(0);
	#latest_depth = 0;

	#handle_collector(collector: Collector): void {
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

	#handle_depth([_idx, d]: [number, Break]): void {
		this.#lines.push(this.#latest_line);
		this.#latest_line = new Line(d.depth);
	}

	#handle_wrapper([_idx, w]: [number, Wrapper]): void {
		const pcs = w.unwrap(this.#latest_depth);
		this.#handle_collector(pcs);
	}

	#handle_result([_idx, r]: [number, Result]): void {
		this.#handle_collector(r.collector);
	}

	#cached = false;

	/**
	 * @internal
	 */
	get lines(): Line[] {
		if (this.#cached) return this.#lines;
		this.#cached = true;
		this.#handle_collector(this.collector);
		this.#lines.push(this.#latest_line);
		return this.#lines;
	}

	/**
	 * Get the stringified output.
	 */
	get code(): string {
		return this.lines.map((ln) => ln.toString(this.opts.indent)).join(char.NL);
	}
}

/**
 * @internal
 */
class Line {
	/**
	 * Determines at which indentation level this line is supposed to be.
	 */
	depth: number;
	/**
	 * Content of line.
	 */
	output: string[] = [];

	constructor(depth: number, ...output: string[][]) {
		this.depth = depth;
		for (const o of output) this.output.push(...o);
	}

	toString(indent: string): string {
		return indent.repeat(this.depth) + this.output.join("");
	}
}

/**
 * ## Legend
 *
 * - `"inline"` - prevent from making it mutliline
 * - `"mutliline"` - prevent from making it inlined
 * - `"both"` - allow both -> will go mutliline when exceeding set max line length
 */
type WrapperType = "inline" | "mutliline" | "both";

/**
 * @internal
 */
export abstract class Wrapper<T extends WrapperType = WrapperType> {
	static START: string;
	static END: string;

	collector: Collector = new Collector();
	type: T;

	constructor(type: T, ...pieces: Parameters<Collector["append"]>) {
		this.type = type;
		this.collector.append(...pieces);
	}

	get size(): number {
		// NOTE: Include brackets start/end - hence `+ 2`
		return this.collector.length + 2;
	}

	insert(...pieces: Parameters<Collector["append"]>): void {
		this.collector.append(...pieces);
	}

	unwrap(latest_depth: number): Collector {
		switch (this.type) {
			case "inline": {
				this.collector.pieces.unshift((this.constructor as typeof Wrapper).START);
				this.collector.pieces.push((this.constructor as typeof Wrapper).END);
				return this.collector;
			}
			case "mutliline": {
				this.collector.pieces = this.collector.pieces.flatMap((pc, idx, arr) => {
					return idx < arr.length - 1 ? [pc, new Break(latest_depth + 1)] : [pc];
				});
				this.collector.pieces.unshift(
					//
					(this.constructor as typeof Wrapper).START,
					new Break(latest_depth + 1),
				);
				this.collector.pieces.push(
					//
					new Break(latest_depth),
					(this.constructor as typeof Wrapper).END,
				);
				return this.collector;
			}
			case "both": {
				// TODO: Handle when there's a feature of line breaking when line length is exceeded.
				this.collector.pieces.unshift((this.constructor as typeof Wrapper).START);
				this.collector.pieces.push((this.constructor as typeof Wrapper).END);
				return this.collector;
			}
			default: {
				throw new TypeError(`Unrecognized wrapper type: ${this.type}`);
			}
		}
	}
}
