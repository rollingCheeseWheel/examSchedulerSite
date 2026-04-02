import { Button, Container, NativeSelect, Paper, Title } from "@mantine/core";
import { useFetch } from "@mantine/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { endpoints } from "../../../endpoints";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { School } from "../../../models/school";

export function AuthWidget() {
	const { t } = useTranslation();
	const {
		data,
		error: schoolFetchError,
		loading,
		abort: abortSchoolLoad,
	} = useFetch<School[]>(endpoints.schools);

	useEffect(() => {
		return abortSchoolLoad;
	}, [abortSchoolLoad]);

	const [localStorage, setLocalStorage] =
		useLocalStorage<string>("lastSelectedSchool");

	return (
		<Container size={420} my={40} style={{ minWidth: 300 }}>
			<Title ta="center" className="title">
				Login
			</Title>

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<NativeSelect
					error={schoolFetchError ? t("auth.school.error") : undefined}
					label={t("auth.school.select")}
					value={localStorage}
					onChange={(e) => setLocalStorage(e.currentTarget.value)}
					data={
						data ?
							data.map((school) => {
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
							})
						:	undefined
					}
					required></NativeSelect>
				<Button
					fullWidth
					mt="md"
					radius="md"
					disabled={loading}
					onClick={() => {
						if (localStorage) window.location.href = localStorage;
					}}>
					Login
				</Button>
			</Paper>
		</Container>
	);
}
