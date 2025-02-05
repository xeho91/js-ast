/**
 * @import { UserWorkspaceConfig } from "vitest/config";
 */

import path from "node:path";
import url from "node:url";

import { loadEnv } from "vite";
import { defineWorkspace } from "vitest/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @satisfies {NonNullable<UserWorkspaceConfig>["test"]} */
const SHARED = {
	env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
	typecheck: {
		enabled: true,
	},
};

/** @see {@link https://vitest.dev/guide/workspace} */
const config = defineWorkspace([
	{
		test: {
			...SHARED,
			name: "svelte-ast-print",
			root: path.resolve(__dirname, "packages", "svelte-ast-print"),
		},
	},
]);

export default config;
