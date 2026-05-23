import { Button } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useCallback, useEffect, useRef } from "react";
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
	const _connection = useHubConnection((s) => s.data);
	const connectionRef = useRef(_connection);
	useEffect(() => {
		connectionRef.current = _connection;
	}, [_connection]);

	const [isLoggedIn, setSessionEnd] = useIsLoggedIn();
	const { resolve } = usePromise({
		onSuccess: () => setSessionEnd(0),
	});

	const onClick = useCallback(
		() =>
			resolve(
				api(endpoints.auth.logout, {
					method: "GET",
				}),
				{
					onSuccess: () => {
						resolve(connectionRef.current?.disconnect(), {
							onSuccess: () =>
								navigate({ pathname: "/auth" }, { replace: true }),
						});
					},
				},
			),
		[navigate, resolve],
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
