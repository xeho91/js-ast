import { Wrapper } from "./shared.js";

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
