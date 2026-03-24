import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		visualizer({
			filename: "./stats.html",
			open: true,
			brotliSize: true,
			gzipSize: true,
			openOptions: {
				background: true,
				allowNonzeroExitCode: false,
				newInstance: false,
			},
		}),
	],
	build: {
		minify: "esbuild",
		outDir: "../examScheduler/examScheduler/wwwroot",
		// outDir: "./dist/",
		rollupOptions: {
			external: [],
		},
	},
});
