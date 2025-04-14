/**
 * @import { UserWorkspaceConfig } from "vitest/config";
 */

import fs from "node:fs";
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
export default defineWorkspace(
	(
		await Array.fromAsync(
			fs.promises.glob(path.resolve(__dirname, "packages", "*"), {
				withFileTypes: true,
			}),
		)
	)
		.filter((d) => d.isDirectory())
		.map((pkg) => ({
			test: {
				...SHARED,
				name: pkg.name,
				root: path.join(pkg.parentPath, pkg.name),
			},
		})),
);
