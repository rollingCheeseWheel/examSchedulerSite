import {
	Button,
	Container,
	NativeSelect,
	Paper,
	Title,
} from "@mantine/core";
import classes from "./../common/AppShellSpine.module.css";
import { useRef } from "react";
import { useFetch } from "@mantine/hooks";
import type { School } from "../models/school";

export function AuthWidget() {
	const { data, error, loading } = useFetch<School[]>("/api/schools");
	const selectRef = useRef<HTMLSelectElement | null>(null);

	function navigate() {
		if (selectRef.current) {
			window.location.href = selectRef.current.value
		}
	}

	return (
		<Container size={420} my={40} style={{minWidth: 300}}>
			<Title ta="center" className={classes.title}>
				Login
			</Title>

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<NativeSelect
					ref={selectRef}
					error={error ? "Failed to load schools, please try again" : undefined}
					label="Select your school"
					data={data ? data.map((school) => {
						const url = new URL("/v2/login/", new URL(school.registerUri).origin);
						url.searchParams.set("client_id", school.clientId);

						return {
							label: school.name,
							value: url.href
						}
					}) : undefined}
					required
				>

				</NativeSelect>
				<Button
					fullWidth
					mt="md"
					radius="md"
					disabled={loading}
					onClick={navigate}>
					Login
				</Button>
			</Paper>
		</Container >
	);
}
