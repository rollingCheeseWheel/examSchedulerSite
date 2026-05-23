import { Button } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { usePromise } from "../../../hooks/usePromise";
import { useHubConnection } from "../../../hooks/zustand";
import { api } from "../../../main";

export function LogoutButton() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const signalr = useHubConnection((s) => s.data);
	const [isLoggedIn, setSessionEnd] = useIsLoggedIn();
	const { resolve } = usePromise();

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
						navigate({ pathname: "/auth" }, { replace: true });
					},
				},
			),
		[navigate, resolve, setSessionEnd, signalr],
	);

	if (!isLoggedIn) {
		return <></>;
	}

	return (
		<Button leftSection={<IconLogout2 />} onClick={onClick}>
			{t("logout")}
		</Button>
	);
}
