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
import { ExamSchedule } from "./schedule/Schedule";

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
								{/* wildcard */}
								{/* <Route
									path="*"
									element={<Navigate to="/login" />}
								/> */}

								<Route
									path="*"
									element={
										<ExamSchedule
											{...{
												autoLockIn: 1,
												description: "testdescription",
												firstExamination: "2025-10-12",
												id: "123123123",
												lockInOffset: "0000-00-10",
												subject: {
													name: "testsubject",
												},
												examSlots: [
													{
														date: "2025-10-12",
														id: "öasldfjzhui",
														minParticipants: 6,
														maxParticipants: 7,
														actuallyParticipated:
															[],
														participants: [
															{
																classroom: {
																	calendarId:
																		"asdfasdf",
																	id: "lkajshdfkjlgas",
																	name: "4E WI",
																	schoolId:
																		"asdflökjasdf",
																},
																userProfile: {
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
															},
														],
													},
												],
											}}></ExamSchedule>
									}></Route>
							</DefaultAppShell>
						}
					/>
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>
);
