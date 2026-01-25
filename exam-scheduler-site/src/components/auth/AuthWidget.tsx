import { Button, Container, NativeSelect, Paper, Title } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useFetch } from "@mantine/hooks";
import type { School } from "../../models/school";
import { useTranslation } from "react-i18next";
import { useCrossSiteError } from "../../zustand/zustand";
import { endpoints } from "../../endpoints";

export function AuthWidget() {
	const { data, error: schoolFetchError, loading, abort } = useFetch<School[]>(
		endpoints.schools,
	);
	const crossSiteError = useCrossSiteError((s) => s.instance);

	useEffect(() => {
		return abort;
	}, [abort]);

	const selectRef = useRef<HTMLSelectElement | null>(null);
	const { t } = useTranslation();

	function navigate() {
		if (selectRef.current) {
			window.location.href = selectRef.current.value;
		}
	}

	return (
		<Container size={420} my={40} style={{ minWidth: 300 }}>
			<Title ta="center" className="title">
				Login
			</Title>

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<NativeSelect
					ref={selectRef}
					error={
						(crossSiteError ?? schoolFetchError) ?
							t("auth.school.error")
						:	undefined
					} // Failed to load schools, please try again
					label={t("auth.school.select")} // "Select your school"
					data={
						data ?
							data.map((school) => {
								const url = new URL(
									"/v2/login/",
									new URL(school.registerUri).origin,
								);
								url.searchParams.set(
									"client_id",
									school.clientId,
								);

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
					onClick={navigate}>
					Login
				</Button>
			</Paper>
		</Container>
	);
}
