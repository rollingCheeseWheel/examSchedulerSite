import {
	Anchor,
	Button,
	Checkbox,
	Container,
	Group,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import classes from "./../common/AppShellSpine.module.css";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function LoginWidget() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [saveLogin, { toggle }] = useDisclosure(true);

	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	function handleSignIn() {
		if (!username || !password) {
			if (!username) {
				setUsernameError("Please enter your username");
			}
			if (!password) {
				setPasswordError("Please enter your password");
			}
			return;
		}
	}

	return (
		<Container size={420} my={40}>
			<Title ta="center" className={classes.title}>
				Welcome back!
			</Title>

			<Text className={classes.subtitle}>
				Do not have an account yet?{" "}
				<Anchor href="/signup">Create account</Anchor>
			</Text>

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<TextInput
					label="Username"
					placeholder="Your username"
					required
					radius="md"
					onChange={(e) => {
						setUsernameError("");
						setUsername(e.target.value);
					}}
					error={usernameError}
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="sm"
					radius="md"
					onChange={(e) => {
						setPasswordError("");
						setPassword(e.target.value);
					}}
					error={passwordError}
				/>
				<Group justify="space-between" mt="md">
					<Checkbox
						label="Remember me"
						onChange={toggle}
						checked={saveLogin}
					/>
				</Group>
				<Button fullWidth mt="md" radius="md" onClick={handleSignIn}>
					Sign in
				</Button>
			</Paper>
		</Container>
	);
}
