import { Button } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useLoadingOverlay, useHubConnection, useIsLoggedIn } from "../../../hooks/zustand";
import { useLoadingPromise } from "../../../hooks/useLoadingPromise";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import {
	api,
} from "../../../main";
import { useEffect } from "react";

export function LogoutButton() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const signalr = useHubConnection(s => s.data);
	const loggedIn = useIsLoggedIn(s => s.state);
	const setLoadingOverlay = useLoadingOverlay((s) => s.setState);
	const { resolve, abort } = useLoadingPromise({
		onLoading: setLoadingOverlay,
		onSuccess: () => {
			resolve(signalr?.disconnect());
			navigate("/auth");
		},
	});

	useEffect(() => abort, [abort]);

	if (!loggedIn) {
		return <></>;
	}

	return (
		<Button
			leftSection={<IconLogout2 />}
			onClick={() =>
				resolve(
					api(endpoints.auth.logout, {
						method: "GET",
					}),
				)
			}>
			{t("logout")}
		</Button>
	);
}
