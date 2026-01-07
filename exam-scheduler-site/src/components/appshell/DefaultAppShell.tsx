import type { ReactNode } from "react";
import { AppShellSpine } from "./AppShellSpine";
import { useIsFirstRender, useLocalStorage } from "@mantine/hooks";
import { Routes } from "react-router-dom";
import type { LinkGroupProp } from "../navbar-link-group/LinkGroup";
import { NestedNavbar } from "../navbar-link-group/NestedNavbar";
import { useNavbarMenu } from "../../zustand/zustand";

export interface DefaultAppShellProps {
	children?: ReactNode;
	linkData?: LinkGroupProp[];
}

export function DefaultAppShell({ children, linkData }: DefaultAppShellProps) {
	const { data, setData } = useNavbarMenu();

	const initialNavbarlinks: LinkGroupProp[] = linkData ?? [
		{
			label: "test",
			links: [
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
				{ label: "test", link: "/" },
			],
			initiallyOpened: true,
		},
		{ label: "test", defaultLink: "/" },
		{ label: "test", defaultLink: "/", initiallyOpened: true },
	];

	if (useIsFirstRender()) {
		setData(initialNavbarlinks);
	}

	const navbar = <NestedNavbar data={data} />;

	return (
		<AppShellSpine navbar={navbar} opened>
			{<Routes>{children}</Routes>}
		</AppShellSpine>
	);
}
