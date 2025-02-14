import { Wrapper } from "./shared.ts";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class AngleBrackets extends Wrapper {
	static override readonly START = "<";
	static override readonly END = ">";
}
/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class CurlyBrackets extends Wrapper {
	static override readonly START = "{";
	static override readonly END = "}";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class RoundBrackets extends Wrapper {
	static override readonly START = "(";
	static override readonly END = ")";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class SquareBrackets extends Wrapper {
	static override readonly START = "[";
	static override readonly END = "]";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class DoubleQuotes extends Wrapper {
	static override readonly START = '"';
	static override readonly END = '"';
}
