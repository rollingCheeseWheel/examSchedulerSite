import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Center, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellSpine } from "./components/appshell/AppShellSpine";
import { DefaultAppShell } from "./components/appshell/DefaultAppShell";
import { AuthWidget } from "./components/auth/AuthWidget";
import { ExamSchedule } from "./components/schedule/Schedule";
import { AuthCallback } from "./components/auth/AuthCallback";
import { AutoLockIn } from "./models/enums";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// const color: MantineColorsTuple = [
// 	"#f6eeff",
// 	"#e7d9f7",
// 	"#cab1ea",
// 	"#ad86dd",
// 	"#9462d2",
// 	"#854bcb",
// 	"#7d3fc9",
// 	"#6b31b2",
// 	"#5f2ba0",
// 	"#52238d",
// ];

// const theme = createTheme({
// 	colors: { color },
// });

import english from "./locales/en_translation.json";
import german from "./locales/de_translation.json";
import { CreateScheduleWidget } from "./components/schedule-create/CreateScheduleWidget";

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
							<DefaultAppShell authEnabled>
								<Route
									path="*"
									element={<CreateScheduleWidget />}></Route>
							</DefaultAppShell>
						}
					/>
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>
);
