import { useEffect } from "react";
import { Route } from "react-router-dom";
import { DefaultAppShell } from "../components/common/appshell/DefaultAppShell";
import { ScheduleWidget } from "../components/common/schedule/ScheduleWidget";
import { CreateScheduleWidget } from "../components/teacher/schedule-create/CreateScheduleWidget";
import { useSchedules, useUserProfile } from "../zustand/zustand";

export function DashboardPage() {
	useInitMockUpData();

	return (
		<DefaultAppShell authDisabled={true}>
			<Route path="/" element={<ScheduleWidget maxwidth="600px" />} />
			<Route path="create" element={<CreateScheduleWidget />} />
		</DefaultAppShell>
	);
}

function useInitMockUpData() {
	const setUserProfile = useUserProfile((s) => s.setData);
	const setSchedules = useSchedules((s) => s.setData);

	useEffect(() => {
		setUserProfile({
			id: "676767",
			name: "Laurin Feichter",
			role: "student",
		});

		setSchedules([
			{
				id: "sadfasdf",
				startDate: new Date("2026-01-01"),
				endDate: new Date("2026-02-01"),
				lockInOffset: new Date("0000-00-01"),
				autoLockIn: "fixedDate",
				subject: { name: "Rechtskunde" },
				teachers: [{ name: "Brigitta Niederkofler" }],
				description: "Handelsrecht und Arbeitsrecht",
				examSlots: [
					{
						id: "asdfasdfasdf",
						date: new Date("2026-01-01"),
						minParticipants: 10,
						maxParticipants: 10,
						isLocked: false,
						participants: [
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Lauasdfasdfasdfrin Feichter",
								role: "student",
							},
						],
					},
					{
						id: "sdfghdfghdfgh",
						date: new Date("2026-01-02"),
						minParticipants: 1,
						maxParticipants: 4,
						isLocked: false,
						participants: [
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
						],
					},
					{
						id: "QWAERASDFF",
						date: new Date("2026-01-03"),
						minParticipants: 1,
						maxParticipants: 4,
						isLocked: false,
						participants: [
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: "student",
							},
						],
					},
				],
				swapRequests: [
					{
						id: "aölkjklöasdhf",
						requestedSlotId: "asdfasdfasdf",
						requestingStudentId: "676767",
						requestingStudentName: "Laurin Feichter",
					},
					{
						id: "aölkjklöasdhf",
						requestedSlotId: "asdfasdfasdf",
						requestingStudentId: "asdfasdfasdf",
						requestingStudentName: "Laurin Feichter",
					},
				],
				auditLogs: [],
			},
		]);
	}, [setSchedules, setUserProfile]);
}
