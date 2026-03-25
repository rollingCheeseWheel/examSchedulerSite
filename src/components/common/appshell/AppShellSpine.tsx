import { AppShell, Group, LoadingOverlay, Title } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { type ReactNode } from "react";
import { useLoadingOverlay } from "../../../hooks/zustand";
import { ThemeButton } from "../../common/ThemeButton";
import classes from "./AppShellSpine.module.css";

export function AppShellSpine(props: { children?: ReactNode | ReactNode[] }) {
	const isLoadingOverlayOpen = useLoadingOverlay((s) => s.state);

	return (
		<>
			<LoadingOverlay visible={isLoadingOverlayOpen} />
			<AppShell header={{ height: "3rem" }}>
				<AppShell.Header style={{ margin: "0.2rem", paddingLeft: "0.4rem" }}>
					<Group justify="space-between">
						<Group>
							<Title className={classes.title}>Exam Scheduler</Title>
						</Group>
						<Group>
							<ThemeButton />
						</Group>
					</Group>
				</AppShell.Header>
				<AppShell.Main>
					<Notifications />
					{...Array.isArray(props.children) ? props.children
					: props.children ? [props.children]
					: []}
				</AppShell.Main>
			</AppShell>
		</>
	);
}
