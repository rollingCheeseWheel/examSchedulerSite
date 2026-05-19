import { Button } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
	useLoadingOverlay,
	useHubConnection,
} from "../../../hooks/zustand";
import { useLoadingPromise } from "../../../hooks/useLoadingPromise";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { api, tokenExpirationInMillisecondsLocalStorageKey } from "../../../main";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { DateNumber } from "../../../models/brand";

export function LogoutButton() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const signalr = useHubConnection((s) => s.data);
	const [sessionEnd, setSessionEnd] = useLocalStorage<DateNumber>(tokenExpirationInMillisecondsLocalStorageKey);
	const setLoadingOverlay = useLoadingOverlay((s) => s.setState);
	const { resolve, abort } = useLoadingPromise({
		onLoading: setLoadingOverlay,
	});

	useEffect(() => abort, [abort]);

	const onClick = useCallback(
		() =>
			resolve(
				api(endpoints.auth.logout, {
					method: "GET",
				}),
				{
					onSuccess: () => {
						setSessionEnd(0);
						resolve(signalr?.disconnect());
						navigate("/auth");
					},
				},
			),
		[navigate, resolve, setSessionEnd, signalr],
	);

	if (!sessionEnd || sessionEnd < Date.now()) {
		return <></>;
	}

	return (
		<Button leftSection={<IconLogout2 />} onClick={onClick}>
			{t("logout")}
		</Button>
	);
}
