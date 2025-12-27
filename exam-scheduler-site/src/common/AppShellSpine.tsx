import { AppShell, Group, LoadingOverlay, Title } from "@mantine/core";
import classes from "./AppShellSpine.module.css";
import ThemeButton from "../common/ThemeButton";
import type { ReactNode } from "react";
import { IconMenu2 } from "@tabler/icons-react";
import Swipable from "./Swipable";
import type { SwipeableProps } from "react-swipeable";
import { useIsFirstRender } from "@mantine/hooks";
import { useLoadingOverlay, useNavbarState } from "./zustand/zustand";

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
	const isLoadingOverlayOpen =
		useLoadingOverlay((s) => s.isOpen);
	const { isOpen: isNavbarOpen, setState: setNavbarState, toggle } = useNavbarState();

	if (useIsFirstRender()) {
		// idk why this works
		setNavbarState((opened && disabled) || false);
	}

	const swipeableProps: SwipeableProps = {
		onSwipedLeft: () => setNavbarState(false),
		onSwipedRight: () => setNavbarState(true),
	};

	const appShellProps =
		navbar && !disabled
			? {
					navbar: {
						breakpoint: "sm",
						width: 300,
						collapsed: { desktop: isNavbarOpen, mobile: !isNavbarOpen },
					},
			  }
			: {};

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
					<AppShell.Main>{children}</AppShell.Main>
					{navbar && <AppShell.Navbar>{navbar}</AppShell.Navbar>}
				</AppShell>
			</Swipable>
		</>
	);
}
