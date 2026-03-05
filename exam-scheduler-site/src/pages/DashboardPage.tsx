import { faker } from "@faker-js/faker";
import { Box } from "@mantine/core";
import { useEffect } from "react";
import { Route } from "react-router-dom";
import { DefaultAppShell } from "../components/common/appshell/DefaultAppShell";
import { TimeTable } from "../components/teacher/schedule-create/ScheduleCreateModal";
import { timeTableSlots } from "../main";
import { randomId } from "../util";
import { useSchedules, useUserProfile } from "../zustand/zustand";

export function DashboardPage() {
	useInitMockUpData();

	return (
		<DefaultAppShell authDisabled={true}>
			{/* <Route path="/" element={<ScheduleWidget maxwidth="600px" />} /> */}
			<Route
				path="/"
				element={
					<Box h="600px" w="400px">
						<TimeTable slots={timeTableSlots} />
					</Box>
				}
			/>
			{/* <Route path="create" element={<CreateScheduleWidget />} /> */}
		</DefaultAppShell>
	);
}

function useInitMockUpData() {
	const setUserProfile = useUserProfile((s) => s.setData);
	const setSchedules = useSchedules((s) => s.setData);

	useEffect(() => {
		setUserProfile({
			id: randomId("user"),
			name: faker.person.fullName(),
			role: "teacher",
		});

		setSchedules([
			{
				id: randomId(),
				startDate: "2026-01-01",
				endDate: "2026-02-01",
				lockInOffset: "1970-01-01",
				autoLockIn: "fixedDate",
				subject: { name: "Rechtskunde" },
				teachers: [{ name: "Brigitta Niederkofler" }],
				description: "Handelsrecht und Arbeitsrecht",
				examSlots: [
					{
						id: randomId(),
						date: "2026-01-01",
						minParticipants: 10,
						maxParticipants: 10,
						lockState: "definite",
						participants: [
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
						],
					},
					{
						id: randomId(),
						date: "2026-01-02",
						minParticipants: 1,
						maxParticipants: 4,
						lockState: "locked",
						participants: [
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
						],
					},
					{
						id: randomId("swaponly"),
						date: "2026-01-03",
						minParticipants: 1,
						maxParticipants: 4,
						lockState: "open",
						participants: [
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
							{
								id: randomId(),
								name: faker.person.fullName(),
								role: "student",
							},
						],
					},
				],
				swapRequests: [
					{
						id: randomId(),
						requestedSlotId: randomId("swaponly"),
						requestingStudentId: randomId("user"),
						requestingStudentName: faker.person.fullName(),
					},
					{
						id: randomId(),
						requestedSlotId: randomId("swaponly"),
						requestingStudentId: randomId(),
						requestingStudentName: faker.person.fullName(),
					},
				],
				auditLogs: [],
			},
		]);
	}, [setSchedules, setUserProfile]);
}
