import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,jsx}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx}"],
		languageOptions: { globals: globals.browser },
	},
	{
		settings: {
			react: {
				version: "18.2",
			},
		},
	},
	pluginReact.configs.flat.recommended,
]);
