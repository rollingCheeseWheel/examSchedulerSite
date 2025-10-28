import { AppShell, Group, Title } from "@mantine/core";
import classes from "./AppShellSpine.module.css";
import ThemeButton from "../common/ThemeButton";
import type { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";

export interface AppShellSpineProps {
	children?: React.ReactNode;
	navbar?: ReactNode;
}

export function AppShellSpine(props: AppShellSpineProps) {
	const { children, navbar } = props;
	const [opened, { toggle }] = useDisclosure();

	const appShellProps = navbar
		? {
				navbar: {
					breakpoint: "sm",
					width: 300,
					collapsed: { desktop: opened, mobile: !opened },
				},
		  }
		: {};

	return (
		<AppShell {...appShellProps} header={{ height: "3rem" }}>
			<AppShell.Header
				style={{ margin: "0.2rem", paddingLeft: "0.4rem" }}>
				<Group justify="space-between">
					<Group>
						{navbar && <IconMenu2 onClick={toggle} />}
						<Title className={classes.title}>Exam Scheduler</Title>
					</Group>
					<Group>
						<ThemeButton />
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
			{navbar && <AppShell.Navbar>{navbar}</AppShell.Navbar>}
		</AppShell>
	);
}
