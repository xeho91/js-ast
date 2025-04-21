import type * as JS from "estree";
import type { AST as SV } from "svelte/compiler";

// NOTE:
// Overriding properties related to positioning, location, etc. by making them optional.
// They have no influence on printing, and unnecessarily forces the end-users to provide those properties.
declare module "svelte/compiler" {
	export namespace AST {
		interface BaseNode {
			type: string;
			// @ts-expect-error NOTE: Intentional - no influence on printing
			start?: number;
			// @ts-expect-error NOTE: Intentional - no influence on printing
			end?: number;
		}

		export type HTMLNode = SV.Comment | SV.Text;
	}
}

export type SvelteOnlyNode =
	| SV.AttributeLike
	| SV.Block
	| SV.CSS.Node
	| SV.Directive
	| SV.ElementLike
	| SV.Fragment
	| SV.HTMLNode
	| SV.Root
	| SV.Script
	| SV.Tag;

export type Node = JS.Node | SvelteOnlyNode;
