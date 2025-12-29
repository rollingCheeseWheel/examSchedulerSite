export default {
	locales: ["en", "it", "de"],
	output: "public/locales/$LOCALE/$NAMESPACE.json",
	input: ["src/**/*.{ts,tsx,js,jsx}"],
	lexers: {
		ts: ["JavascriptLexer"],
		tsx: ["JsxLexer"],
		default: ["JsxLexer"],
	},
	keySeparator: ".",
	namespaceSeparator: ":",
	defaultValue: "",
	defaultNamespace: "translation",
	createOldCatalogs: true,
	sort: true,
	verbose: true,
	indentation: 4,
};
