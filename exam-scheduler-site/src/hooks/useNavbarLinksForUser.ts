import {
	IconCalendarClock,
	IconChalkboardTeacher,
	IconReplaceUser,
} from "@tabler/icons-react";
import type { TFunction } from "i18next";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { NestedLinkProp } from "../components/common/navbar-link-group/LinkGroup";
import { join } from "../endpoints";
import type { Classroom } from "../models/classroom";
import type { UserRole } from "../models/enums";
import {
	useClassrooms,
	useNavbarLinks,
	useUserProfile,
} from "../zustand/zustand";

export function useNavbarLinksForUser() {
	const role = useUserProfile((s) => s.data)?.role;
	const classrooms = useClassrooms((s) => s.data);
	const { t } = useTranslation();
	const setNavbarLinks = useNavbarLinks((s) => s.setData);

	const links = useCallback(
		() => getLinksForRole(role, t, classrooms),
		[classrooms, role, t],
	);

	const updateNavbar = useCallback(
		() => setNavbarLinks(links()),
		[links, setNavbarLinks],
	);

	return { links, updateNavbar };
}

function getLinksForRole(
	role: UserRole | undefined,
	t: TFunction<"translation", undefined>,
	classrooms: Classroom[],
) {
	switch (role) {
		case "student":
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
		case "teacher":
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
			// testing only
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
