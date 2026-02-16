import { Center, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import axios from "axios";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellSpine } from "./components/common/appshell/AppShellSpine";
import { DefaultAppShell } from "./components/common/appshell/DefaultAppShell";
import { AuthWidget } from "./components/common/auth/AuthWidget";
import { refreshSession } from "./components/common/auth/refreshSession";
import { ScheduleWidget } from "./components/common/schedule/ScheduleWidget";
import { CreateScheduleWidget } from "./components/teacher/schedule-create/CreateScheduleWidget";
import german from "./locales/de_translation.json";
import english from "./locales/en_translation.json";

export const api = axios.create({
	withCredentials: true,
});

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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto">
			<BrowserRouter>
				<Routes>
					<Route
						path="/auth"
						element={
							<AppShellSpine disabled>
								<Center
									style={{
										height: "80dvh",
										overflow: "hidden",
									}}>
									<AuthWidget />
								</Center>
							</AppShellSpine>
						}
					/>
					<Route
						path="*"
						element={
							<DefaultAppShell>
								<Route
									path="/"
									element={
										<ScheduleWidget maxwidth="600px" />
									}
								/>
								<Route
									path="create"
									element={<CreateScheduleWidget />}
								/>
							</DefaultAppShell>
						}
					/>
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>,
);
