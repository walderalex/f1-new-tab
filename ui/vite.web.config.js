import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	base: "/",
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
	build: {
		outDir: "dist-web",
		rollupOptions: {
			input: {
				index: resolve(process.cwd(), "index.html"),
			},
		},
	},
});
