import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Center, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellSpine } from "./common/AppShellSpine";
import { DefaultAppShell } from "./common/DefaultAppShell";
import { AuthWidget } from "./auth/AuthWidget";
import { ExamSchedule } from "./schedule/Schedule";
import { AuthCallback } from "./auth/AuthCallback";
import { AutoLockIn } from "./models/enums";

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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto" /* theme={theme} */>
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
							<>
								<AuthCallback /* enabled */ />
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
												maxwidth="500px"
												{...{
													autoLockIn:
														AutoLockIn.TimeBeforeExamination,
													description:
														"testdescription",
													firstExamination:
														"2025-10-12",
													id: "123123123",
													lockInOffset: "0000-00-10",
													subject: {
														name: "testsubject",
													},
													selectedSlotId:
														"kjfdhszugzuie",
													examSlots: [
														{
															date: "2025-10-12",
															id: "öasldfjzhui",
															minParticipants: 0,
															maxParticipants: 3,
															actuallyParticipated:
																[],
															participants: [
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
															],
														},
														{
															actuallyParticipated:
																[],
															date: "2025-11-12",
															id: "kjfdhszugzuie",
															minParticipants: 4,
															maxParticipants: 10,
															participants: [
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
															],
														},
														{
															actuallyParticipated:
																[],
															date: "2025-11-12",
															id: "kjfdhszugzuie",
															minParticipants: 0,
															maxParticipants: 2,
															participants: [
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"FeichterFeichterFeichter",
																	id: "asdfasdf",
																	role: 3,
																},
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
																{
																	firstName:
																		"Laurin",
																	lastName:
																		"Feichter",
																	id: "asdfasdf",
																	role: 3,
																},
															],
														},
													],
												}}></ExamSchedule>
										}></Route>
								</DefaultAppShell>
							</>
						}
					/>
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>
);
