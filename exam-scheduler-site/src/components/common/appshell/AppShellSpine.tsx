import {
	AppShell,
	Group,
	LoadingOverlay,
	Title,
	type AppShellProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { IconMenu2 } from "@tabler/icons-react";
import { useEffect, type ReactNode } from "react";
import type { SwipeableProps } from "react-swipeable";
import { useLoadingOverlay, useNavbarState } from "../../../zustand/zustand";
import { Swipable } from "../../common/Swipable";
import { ThemeButton } from "../../common/ThemeButton";
import classes from "./AppShellSpine.module.css";

export function AppShellSpine(props: {
	children?: ReactNode[];
	navbarComponent?: ReactNode;
	navbarOpened?: boolean;
	navbarDisabled?: boolean;
}) {
	const isLoadingOverlayOpen = useLoadingOverlay((s) => s.state);
	const isNavbarOpen = useNavbarState((s) => s.state);
	const setNavbarState = useNavbarState((s) => s.setState);
	const toggleNavbarState = useNavbarState((s) => s.toggle);
	const isLandscape = useMediaQuery("(orientation: landscape)");

	useEffect(() => {
		setNavbarState((props.navbarOpened && props.navbarDisabled) || false);
	}, [props.navbarDisabled, props.navbarOpened, setNavbarState]);

	const swipeableProps: SwipeableProps = {
		onSwipedLeft: () => setNavbarState(isLandscape),
		onSwipedRight: () => setNavbarState(!isLandscape),
	};

	const appShellProps = {
		navbar: {
			breakpoint: "sm",
			width: 250,
			collapsed: {
				desktop: isNavbarOpen,
				mobile: !isNavbarOpen,
			},
		},
	};

	return (
		<>
			<LoadingOverlay visible={isLoadingOverlayOpen} />
			<Swipable swipeableProps={swipeableProps}>
				<AppShell
					{...appShellProps}
					header={{ height: "3rem" }}
					disabled={props.navbarDisabled}>
					<AppShell.Header
						style={{ margin: "0.2rem", paddingLeft: "0.4rem" }}>
						<Group justify="space-between">
							<Group>
								{props.navbarComponent && (
									<IconMenu2 onClick={toggleNavbarState} />
								)}
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
						{...props.children ?? []}
					</AppShell.Main>
					<AppShell.Navbar>{props.navbarComponent}</AppShell.Navbar>
				</AppShell>
			</Swipable>
		</>
	);
}
