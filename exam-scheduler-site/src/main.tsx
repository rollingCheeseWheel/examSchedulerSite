import { faker } from "@faker-js/faker";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import axios from "axios";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { refreshSession } from "./components/common/auth/refreshSession";
import german from "./locales/de_translation.json";
import english from "./locales/en_translation.json";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { attachAxiosCache } from "./util";

faker.seed(67);

export const api = axios.create({
	withCredentials: true,
});

attachAxiosCache(api, /.*calendar/);

api.interceptors.response.use(
	(r) => r,
	async (error) => {
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;
			await refreshSession();
			return api.request(error.config);
		}
		return Promise.reject(error);
	},
);

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
	<StrictMode>
		<MantineProvider defaultColorScheme="auto" /* theme={theme} */>
			<BrowserRouter>
				<Routes>
					<Route path="/auth" element={<LoginPage />} />
					<Route path="*" element={<DashboardPage />} />
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>,
);
