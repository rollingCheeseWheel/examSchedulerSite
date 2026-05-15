import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ofetch } from "ofetch";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import german from "./locales/de_translation.json";
import english from "./locales/en_translation.json";
import italian from "./locales/it_translation.json";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallback } from "./components/common/auth/AuthCallback";
import { setLocalStorage } from "./hooks/useLocalStorage";
import type { DateNumber } from "./models/brand";

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

export const tokenExpirationInMillisecondsLocalStorageKey = "session_end";
export let tokenDurationMillis = 0;
export function setTokenDuration(millis: number) {
	tokenDurationMillis = millis;
}

export const api = ofetch.create({
	credentials: "include",
	onResponse({ response }) {
		if (response.status >= 200 && response.status <= 299) {
			setLocalStorage<DateNumber>(
				tokenExpirationInMillisecondsLocalStorageKey,
				Date.now() + tokenDurationMillis,
			);
		}
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
i18next.addResourceBundle("it", "translation", italian, true);

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
