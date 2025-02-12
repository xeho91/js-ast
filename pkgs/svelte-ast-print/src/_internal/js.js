/**
 * @import * as JS from "estree";
 *
 * @import { Options } from "./option.js";
 */

import * as esrap from "esrap";

import * as char from "./char.js";

/**
 * @internal
 * @param {JS.Node} n
 * @param {Options} opts
 * @returns {string}
 * TODO: Align with `esrap`, if it evers become pluggable
 * Ref: https://github.com/sveltejs/esrap/issues/35
 */
export function print_js(n, opts) {
	return (
		esrap
			.print(n, { indent: opts.indent })
			.code.split(char.NL)
			.map((ln, idx) => {
				// NOTE: it removes empty lines, except for the first one
				if (!idx || !ln) return ln;
				return `${opts.indent}${ln}`;
			})
			.join(char.NL)
			// NOTE: This temporary solution is supposed to remove auto-indentation from the content inside
			// `TemplateLiteral`.
			// Ref: https://github.com/storybookjs/addon-svelte-csf/issues/227
			.replace(/`[^`].*[^`]*`/, (match) => {
				return match.replace(new RegExp(opts.indent, "g"), "");
			})
	);
}
