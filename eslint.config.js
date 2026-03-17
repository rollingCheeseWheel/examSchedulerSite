import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unused_imports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		plugins: {
			"unused-imports": unused_imports,
		},
		files: ["**/*.{ts,tsx,js,jsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/allowInterfaces": "off",
		},
	},
]);
