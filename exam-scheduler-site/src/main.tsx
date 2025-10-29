import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Center, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellSpine } from "./common/AppShellSpine";
import AuthenticationWidget from "./auth/AuthenticationWidget";
import DefaultAppShell from "./common/DefaultAppShell";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto" theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={
							<AppShellSpine disabled>
								<Center
									style={{
										height: "80dvh",
										overflow: "hidden",
									}}>
									<AuthenticationWidget />
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
