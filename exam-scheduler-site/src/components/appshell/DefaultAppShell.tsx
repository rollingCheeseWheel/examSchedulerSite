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
	useUserProfile,
} from "../../zustand/zustand";
import { AuthCallback } from "../auth/AuthCallback";
import { UserRole } from "../../models/enums";
import { useTranslation } from "react-i18next";
import { join } from "../../endpoints";
import {
	IconCalendarClock,
	IconChalkboardTeacher,
	IconReplaceUser,
} from "@tabler/icons-react";

export interface DefaultAppShellProps {
	children?: ReactNode;
	authEnabled?: boolean;
}

export function DefaultAppShell({
	children,
	authEnabled,
}: DefaultAppShellProps) {
	useNavbarMenu((s) => s.setData)(useNavbarLinksForUser());

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
				// {
				// 	label: t("navbar.overview"),
				// 	defaultLink: "/",
				// 	icon: IconCalendarClock,
				// },
				// {
				// 	label: t("navbar.createforclassroom"),
				// 	links: classrooms.map<NestedLinkProp>((c) => ({
				// 		label: c.name,
				// 		link: join("classroom", c.id),
				// 	})),
				// 	initiallyOpened: true,
				// 	icon: IconChalkboardTeacher,
				// },
				// {
				// 	label: t("navbar.swaprequests"),
				// 	defaultLink: "/swaprequests",
				// 	icon: IconReplaceUser,
				// },
			];
	}
}
