import { AppShell, Group, LoadingOverlay, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import classes from "./AppShellSpine.module.css";
import { ThemeButton } from "../ThemeButton";
import type { ReactNode } from "react";
import { IconMenu2 } from "@tabler/icons-react";
import { Swipable } from "../Swipable";
import type { SwipeableProps } from "react-swipeable";
import { useIsFirstRender, useMediaQuery } from "@mantine/hooks";
import { useLoadingOverlay, useNavbarState } from "../../zustand/zustand";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export interface AppShellSpineProps {
	children?: React.ReactNode;
	navbar?: ReactNode;
	opened?: boolean;
	disabled?: boolean;
}

export function AppShellSpine({
	children,
	navbar,
	opened,
	disabled,
}: AppShellSpineProps) {
	const isLoadingOverlayOpen = useLoadingOverlay((s) => s.state);
	const {
		state: isNavbarOpen,
		setState: setNavbarState,
		toggle,
	} = useNavbarState();
	const isLandscape = useMediaQuery("(orientation: landscape)");

	if (useIsFirstRender()) {
		// idk why this works
		setNavbarState((opened && disabled) || false);
	}

	const swipeableProps: SwipeableProps = {
		onSwipedLeft: () => setNavbarState(isLandscape),
		onSwipedRight: () => setNavbarState(!isLandscape),
	};

	const appShellProps =
		navbar && !disabled ?
			{
				navbar: {
					breakpoint: "sm",
					width: 300,
					collapsed: {
						desktop: isNavbarOpen,
						mobile: !isNavbarOpen,
					},
				},
			}
		:	{};

	return (
		<>
			<LoadingOverlay visible={isLoadingOverlayOpen} />
			<Swipable swipeableProps={swipeableProps}>
				<AppShell {...appShellProps} header={{ height: "3rem" }}>
					<AppShell.Header
						style={{ margin: "0.2rem", paddingLeft: "0.4rem" }}>
						<Group justify="space-between">
							<Group>
								{navbar && <IconMenu2 onClick={toggle} />}
								<Title className={classes.title}>
									Exam Scheduler
								</Title>
							</Group>
							<Group>
								<ThemeButton />
							</Group>
						</Group>
					</AppShell.Header>
					<AppShell.Main>
						<Notifications />
						{children}
					</AppShell.Main>
					{navbar && <AppShell.Navbar>{navbar}</AppShell.Navbar>}
				</AppShell>
			</Swipable>
		</>
	);
}
