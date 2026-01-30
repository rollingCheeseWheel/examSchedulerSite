import type { ReactNode } from "react";
import { AppShellSpine } from "./AppShellSpine";
import { Routes } from "react-router-dom";
import type {
	LinkGroupProp,
	NestedLinkProp,
} from "../navbar-link-group/LinkGroup";
import { NestedNavbar } from "../navbar-link-group/NestedNavbar";
import {
	useClassrooms,
	useNavbarMenu,
	useSchedules,
	useUserProfile,
} from "../../zustand/zustand";
import { AuthCallback } from "../auth/AuthCallback";
import { AutoLockIn, UserRole } from "../../models/enums";
import { useTranslation } from "react-i18next";
import { join } from "../../endpoints";
import {
	IconCalendarClock,
	IconChalkboardTeacher,
	IconReplaceUser,
} from "@tabler/icons-react";
import { useIsFirstRender } from "@mantine/hooks";

export interface DefaultAppShellProps {
	children?: ReactNode;
	authEnabled?: boolean;
}

export function DefaultAppShell({
	children,
	authEnabled,
}: DefaultAppShellProps) {
	useNavbarMenu((s) => s.setData)(useNavbarLinksForUser());

	const setUserProfile = useUserProfile((s) => s.setData);
	const setSchedules = useSchedules((s) => s.setData);

	if (useIsFirstRender()) {
		setUserProfile({
			id: "676767",
			name: "Laurin Feichter",
			role: UserRole.Student,
		});

		setSchedules([
			{
				id: "sadfasdf",
				startDate: new Date("2026-01-01"),
				endDate: new Date("2026-02-01"),
				lockInOffset: new Date("0000-00-01"),
				autoLockIn: AutoLockIn.FixedDate,
				subject: { name: "Rechtskunde" },
				teachers: [{ name: "Brigitta Niederkofler" }],
				description: "Handelsrecht und Arbeitsrecht",
				examSlots: [
					{
						id: "asdfasdfasdf",
						date: new Date("2026-01-01"),
						minParticipants: 30,
						maxParticipants: 56,
						isLocked: false,
						participants: [
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Lauasdfasdfasdfrin Feichter",
								role: UserRole.Student,
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
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
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
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
							},
							{
								id: "676767",
								name: "Laurin Feichter",
								role: UserRole.Student,
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
	}

	return (
		<AppShellSpine navbar={<NestedNavbar />} opened>
			<AuthCallback enabled={authEnabled}></AuthCallback>
			<Routes>{children}</Routes>
		</AppShellSpine>
	);
}

function useNavbarLinksForUser(): LinkGroupProp[] {
	const role = useUserProfile((s) => s.instance)?.role;
	const classrooms = useClassrooms((s) => s.data);
	const { t } = useTranslation();

	switch (role) {
		case UserRole.Student:
			return [
				{
					label: t("navbar.overview"),
					defaultLink: "/",
					icon: IconCalendarClock,
				},
				{
					label: t("navbar.swaprequests"),
					defaultLink: "/swaprequests",
					icon: IconReplaceUser,
				},
			];
		case UserRole.Teacher:
			return [
				{
					label: t("navbar.overview"),
					defaultLink: "/",
					icon: IconCalendarClock,
				},
				{
					label: t("navbar.createforclassroom"),
					links: classrooms.map<NestedLinkProp>((c) => ({
						label: c.name,
						link: join("classroom", c.id),
					})),
					initiallyOpened: true,
					icon: IconChalkboardTeacher,
				},
			];
		default:
			return [
				{
					label: t("navbar.overview"),
					defaultLink: "/",
					icon: IconCalendarClock,
				},
				{
					label: t("navbar.swaprequests"),
					defaultLink: "/swaprequests",
					icon: IconReplaceUser,
				},
				{
					label: t("navbar.createforclassroom"),
					links: classrooms.map<NestedLinkProp>((c) => ({
						label: c.name,
						link: join("classroom", c.id),
					})),
					initiallyOpened: true,
					icon: IconChalkboardTeacher,
				},
			];
	}
}
