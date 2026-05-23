import { Button, Container, NativeSelect, Paper, Title } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { endpoints } from "../../../endpoints";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { usePromise } from "../../../hooks/usePromise";
import { api } from "../../../main";
import type { School } from "../../../models/school";

export function AuthWidget() {
	const { t } = useTranslation();
	const [schools, setSchools] = useState<School[] | undefined>([]);
	const { resolve } = usePromise({
		onError: useCallback(() => setSchools(undefined), [setSchools]),
	});

	useEffect(
		() =>
			resolve(
				(signal) =>
					api<School[]>(endpoints.schools, {
						method: "GET",
						signal,
					}),
				{
					onSuccess: setSchools,
				},
			),
		[resolve],
	);

	const [localStorage, setLocalStorage] =
		useLocalStorage<string>("lastSelectedSchool");

	return (
		<Container size={420} my={40} style={{ minWidth: 300 }}>
			<Title ta="center" className="title">
				Login
			</Title>

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<NativeSelect
					error={!schools && t("auth.school.error")}
					label={t("auth.school.select")}
					value={localStorage ?? schools?.at(1)?.name}
					onChange={(e) => setLocalStorage(e.currentTarget.value)}
					data={schools?.map((school) => {
						const url = new URL(
							"/v2/login/",
							new URL(school.registerUri).origin,
						);
						url.searchParams.set("client_id", school.clientId);

						return {
							label: school.name,
							value: url.href,
							disabled: !school.isEnabled,
						};
					})}
					required
				/>
				<Button
					fullWidth
					mt="md"
					radius="md"
					onClick={() => {
						if (localStorage) window.location.href = localStorage;
					}}>
					{t("login")}
				</Button>
			</Paper>
		</Container>
	);
}
