export default {
	locales: ["en", "de"],
	output: "src/locales/$LOCALE_$NAMESPACE.json",
	input: ["src/**/*.{ts,tsx,js,jsx}"],
	lexers: {
		ts: ["JavascriptLexer"],
		tsx: ["JsxLexer"],
		default: ["JsxLexer"],
	},
	keySeparator: ".",
	namespaceSeparator: false,
	defaultValue: "MISSING",
	defaultNamespace: "translation",
	createOldCatalogs: true,
	sort: true,
	verbose: true,
	indentation: 4,
};
