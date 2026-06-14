import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			input: {
				index: resolve(process.cwd(), "index.html"),
				background: resolve(process.cwd(), "src/background.ts"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
