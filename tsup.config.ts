import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	minify: true,
	sourcemap: true,
	treeshake: true,
	clean: true
});