import type { ReactNode } from "react";
import { AppShellSpine } from "./AppShellSpine";
import { useLocalStorage } from "@mantine/hooks";
import { Routes } from "react-router-dom";
import type { LinkGroupProps } from "./link/LinkGroup";
import { NestedNavbar } from "./link/NestedNavbar";

export interface DefaultAppShellProps {
	children?: ReactNode;
	linkData?: LinkGroupProps[];
}

export default function DefaultAppShell({ children }: DefaultAppShellProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, _setValue] = useLocalStorage({
		key: "auth-token",
	});

	/* if (!value) {
		return <Navigate to="/login" />;
	} */

	const navbarData: LinkGroupProps[] = [
		{
			label: "test",
			defaultLink: "/bobber",
		},
		{
			label: "test2",
			initiallyOpened: true,
			links: [
				{
					label: "bobber1",
					link: "/bobber1",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
				{
					label: "bobber2",
					link: "/bobber2",
				},
			],
		},
	];

	const navbar = <NestedNavbar data={navbarData} />;

	return (
		<AppShellSpine
			navbar={navbar}
			children={<Routes>{children}</Routes>}></AppShellSpine>
	);
}
