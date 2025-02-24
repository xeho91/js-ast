import { Wrapper } from "../_internal/shared.ts";
import { AngleBrackets } from "../_internal/wrapper.ts";

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export const HTMLOpeningTag = AngleBrackets;

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class HTMLSelfClosingTag extends Wrapper {
	static override readonly START = "<";
	static override readonly END = "/>";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class HTMLClosingTag extends Wrapper {
	static override readonly START = "</";
	static override readonly END = ">";
}

/**
 * @internal
 * @__NO_SIDE_EFFECTS__
 */
export class HTMLComment extends Wrapper {
	static override readonly START = "<!--";
	static override readonly END = "-->";
}
