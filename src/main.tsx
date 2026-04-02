import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ofetch } from "ofetch";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { refreshSession } from "./components/common/auth/refreshSession";
import german from "./locales/de_translation.json";
import english from "./locales/en_translation.json";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { jsonReviver } from "./util";
import { AuthCallback } from "./components/common/auth/AuthCallback";

// [{
// 	color: "blue",
// 	dayOfWeek: 0,
// 	duration: 2,
// 	name: "niddie",
// 	start: 0
// },{
// 	color: "green",
// 	dayOfWeek: 1,
// 	duration: 2,
// 	name: "kuenzer",
// 	start: 0
// },{
// 	color: "yellow",
// 	dayOfWeek: 0,
// 	duration: 2,
// 	name: "lampi",
// 	start: 3
// }]

export const api = ofetch.create({
	credentials: "same-origin",
	async onResponse({ response }) {
		const text = await response.text();
		try {
			return JSON.parse(text, jsonReviver);
		} catch {
			return text;
		}
	},
	async onResponseError({ response, request, options, error }) {
		if (
			response.status == 401 &&
			!/auth/.test(response.url) &&
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(request as any)._retry
		) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(request as any)._retry = true;

			await refreshSession();
			await api(request, options);
		}
		throw error;
	},
});

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		fallbackLng: "de",
		ns: ["translation"],
		defaultNS: "translation",
		keySeparator: ".",
		nsSeparator: false,
		detection: {
			order: ["localstorage", "navigator"],
			caches: ["localstorage"],
		},
	});
i18next.addResourceBundle("en", "translation", english, true);
i18next.addResourceBundle("de", "translation", german, true);

const theme = createTheme({
	colors: {
		paleBlue: [
			"#ecf4ff",
			"#dce4f5",
			"#b9c7e2",
			"#94a8d0",
			"#748dc0",
			"#5f7cb7",
			"#5474b4",
			"#44639f",
			"#3a5890",
			"#2c4b80",
		],
	},
	primaryColor: "paleBlue",
});

createRoot(document.getElementById("root")!).render(
	<MantineProvider defaultColorScheme="auto" /* theme={theme} */>
		<BrowserRouter>
			<AuthCallback />
			<Routes>
				<Route path="/auth" element={<LoginPage />} />
				<Route path="*" element={<DashboardPage />} />
			</Routes>
		</BrowserRouter>
	</MantineProvider>,
);
