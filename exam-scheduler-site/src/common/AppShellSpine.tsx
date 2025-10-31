import { AppShell, Group, LoadingOverlay, Title } from "@mantine/core";
import classes from "./AppShellSpine.module.css";
import ThemeButton from "../common/ThemeButton";
import type { ReactNode } from "react";
import { IconMenu2 } from "@tabler/icons-react";
import {
	NavbarStateProvider,
	useNavbarState,
} from "./providers/NavbarProvider";
import Swipable from "./Swipable";
import type { SwipeableProps } from "react-swipeable";
import {
	LoadingOverlayProvider,
	useLoadingOverlay,
} from "./providers/LoadingOverlayProvider";

export interface AppShellSpineProps {
	children?: React.ReactNode;
	navbar?: ReactNode;
	opened?: boolean;
	disabled?: boolean;
}

export function AppShellSpine(props: AppShellSpineProps) {
	const { opened, disabled } = props;

	return (
		<LoadingOverlayProvider>
			<NavbarStateProvider initialState={(opened && disabled) || false}>
				<AppShellIntermediate {...props} />
			</NavbarStateProvider>
		</LoadingOverlayProvider>
	);
}

function AppShellIntermediate({
	children,
	navbar,
	disabled,
}: AppShellSpineProps) {
	const { state: isLoading, props: loadingProps } = useLoadingOverlay();

	const { state: opened, toggle, setState: setOpened } = useNavbarState();
	const swipeableProps: SwipeableProps = {
		onSwipedLeft: () => setOpened(false),
		onSwipedRight: () => setOpened(true),
	};

	const appShellProps =
		navbar && !disabled
			? {
					navbar: {
						breakpoint: "sm",
						width: 300,
						collapsed: { desktop: opened, mobile: !opened },
					},
			  }
			: {};

	return (
		<>
			<LoadingOverlay visible={isLoading} {...loadingProps} />
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
