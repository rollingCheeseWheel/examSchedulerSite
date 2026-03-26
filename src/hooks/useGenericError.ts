import { notifications } from "@mantine/notifications";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useGenericError() {
	const { t } = useTranslation();
	return useCallback(() => {
		notifications.show({
			message: t("notifications.genericError"),
			autoClose: 5000,
		});
	}, [t]);
}
