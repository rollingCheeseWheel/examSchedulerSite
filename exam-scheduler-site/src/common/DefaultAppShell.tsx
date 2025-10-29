import type { ReactNode } from "react";
import { AppShellSpine } from "./AppShellSpine";
import { useLocalStorage } from "@mantine/hooks";
import { Routes } from "react-router-dom";
import type { LinkGroupProps } from "./link/LinkGroup";
import { NestedNavbar } from "./link/NestedNavbar";
import { NavbarDataProvider, useNavbar } from "./providers/NavbarProvider";

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

	const navbar: LinkGroupProps[] = [
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

	return (
		<NavbarDataProvider initialState={navbar}>
			<AppShellIntermediate>{children}</AppShellIntermediate>
		</NavbarDataProvider>
	);
}

function AppShellIntermediate({ children }: DefaultAppShellProps) {
	const { data: navbarData } = useNavbar();
	const navbar = <NestedNavbar data={navbarData} />;

	return (
		<AppShellSpine navbar={navbar} opened>
			{<Routes>{children}</Routes>}
		</AppShellSpine>
	);
}
