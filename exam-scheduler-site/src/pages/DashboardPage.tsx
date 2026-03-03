import { faker } from "@faker-js/faker";
import { useEffect } from "react";
import { Route } from "react-router-dom";
import { DefaultAppShell } from "../components/common/appshell/DefaultAppShell";
import { ScheduleWidget } from "../components/common/schedule/ScheduleWidget";
import { randomId } from "../util";
import { useSchedules, useUserProfile } from "../zustand/zustand";

export function DashboardPage() {
	useInitMockUpData();

	return (
		<DefaultAppShell authDisabled={true}>
			<Route path="/" element={<ScheduleWidget maxwidth="600px" />} />
			<></>
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
				startDate: new Date("2026-01-01"),
				endDate: new Date("2026-02-01"),
				lockInOffset: new Date("1970-01-01"),
				autoLockIn: "fixedDate",
				subject: { name: "Rechtskunde" },
				teachers: [{ name: "Brigitta Niederkofler" }],
				description: "Handelsrecht und Arbeitsrecht",
				examSlots: [
					{
						id: randomId(),
						date: new Date("2026-01-01"),
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
						date: new Date("2026-01-02"),
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
						date: new Date("2026-01-03"),
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
