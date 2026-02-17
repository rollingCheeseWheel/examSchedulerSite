import { useEffect, useEffectEvent, type ReactNode } from "react";
import { Routes } from "react-router-dom";
import { useNavbarLinksForUser } from "../../../hooks/useNavbarLinksForUser";
import { NestedNavbar } from "../../common/navbar-link-group/NestedNavbar";
import { AuthCallback } from "../auth/AuthCallback";
import { AppShellSpine } from "./AppShellSpine";

export function DefaultAppShell(props: {
	children: ReactNode[];
	authDisabled?: boolean;
}) {
	const updateNavbar = useNavbarLinksForUser().updateNavbar;
	useEffect(updateNavbar, [updateNavbar]);

	return (
		<AppShellSpine navbarComponent={<NestedNavbar />} navbarOpened>
			<AuthCallback disabled={props.authDisabled}></AuthCallback>
			<Routes>{...props.children}</Routes>
		</AppShellSpine>
	);
}
