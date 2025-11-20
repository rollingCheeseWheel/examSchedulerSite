import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	Center,
	createTheme,
	MantineProvider,
	type MantineColorsTuple,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellSpine } from "./common/AppShellSpine";
import DefaultAppShell from "./common/DefaultAppShell";
import AuthWidget from "./auth/AuthWidget";

const color: MantineColorsTuple = [
	"#f6eeff",
	"#e7d9f7",
	"#cab1ea",
	"#ad86dd",
	"#9462d2",
	"#854bcb",
	"#7d3fc9",
	"#6b31b2",
	"#5f2ba0",
	"#52238d",
];

const theme = createTheme({
	colors: { color },
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto" theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route
						path="/auth"
						element={
							<AppShellSpine disabled>
								<Center
									style={{
										height: "80dvh",
										overflow: "hidden"
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
								{/* wildcard */}
								{/* <Route
									path="*"
									element={<Navigate to="/login" />}
								/> */}
							</DefaultAppShell>
						}
					/>
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>
);
