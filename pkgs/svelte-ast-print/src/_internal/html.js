import { Wrapper } from "../_internal/shared.js";
import { AngleBrackets } from "../_internal/wrapper.js";

/**
 * Alias for code readability.
 * @internal
 */
export const HTMLOpeningTag = AngleBrackets;
/**
 * @internal
 */
export class HTMLSelfClosingTag extends Wrapper {
	/** @readonly */
	static START = "<";
	/** @readonly */
	static END = "/>";
}
/**
 * @internal
 */
export class HTMLClosingTag extends Wrapper {
	/** @readonly */
	static START = "</";
	/** @readonly */
	static END = ">";
}
/**
 * @internal
 */
export class HTMLComment extends Wrapper {
	/** @readonly */
	static START = "<!--";
	/** @readonly */
	static END = "-->";
}
