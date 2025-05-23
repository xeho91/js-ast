import * as esrap from "esrap";
import type * as JS from "estree";

import * as char from "./char.ts";
import type { Options } from "./option.ts";

/**
 * @internal
 * TODO: Align with `esrap`, if it evers become pluggable
 * Ref: https://github.com/sveltejs/esrap/issues/35
 */
export function print_js(n: JS.Node, opts: Options, svelte = true): string {
	const { code } = esrap.print(n, { indent: opts.indent });
	if (!svelte) return code;
	return (
		code
			.split(char.NL)
			.map((ln, idx) => {
				// // NOTE: it prevents the first line or empty line from having indentation
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
