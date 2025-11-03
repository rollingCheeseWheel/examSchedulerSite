import {
	Container,
	Title,
	Paper,
	TextInput,
	PasswordInput,
	Button,
	NativeSelect,
} from "@mantine/core";
import classes from "./../common/AppShellSpine.module.css";
import { useState } from "react";
import { IconUser, IconKey, IconSchool } from "@tabler/icons-react";

export default function SignupWidget() {
	const [username, setUsername] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [newAccountPassword, setNewAccountPassword] = useState("");
	const [schoolName, setSchoolName] = useState("");

	const [usernameError, setUsernameError] = useState("");
	const [registerPasswordError, setRegisterPasswordError] = useState("");
	const [newAccountPasswordError, setnewAccountPasswordError] = useState("");
	const [schoolNameError, setSchoolNameError] = useState("");

	function handleSignUp() {
		if (
			!username ||
			!registerPassword ||
			!newAccountPassword ||
			!schoolName
		) {
			if (!username) {
				setUsernameError("Please enter your username");
			}
			if (!registerPassword) {
				setRegisterPasswordError(
					"Please enter your Digitales Register password"
				);
			}
			if (!newAccountPassword) {
				setnewAccountPasswordError("Please enter your new password");
			}
			if (!schoolName) {
				setSchoolNameError("Please select a school");
			}
			return;
		}

		console.log([
			username,
			registerPassword,
			newAccountPassword,
			schoolName,
		]);
	}

	return (
		<Container
			size={420}
			my={40}
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				handleSignUp();
			}}>
			<Title ta="center" className={classes.title}>
				Create an account!
			</Title>

			{/* <Text className={classes.subtitle}>
				Do not have an account yet?{" "}
				<Anchor href="/signup">Create account</Anchor>
			</Text> */}

			<Paper withBorder shadow="sm" p={22} mt="md" radius="md">
				<TextInput
					label="Digital Register username"
					description="This will become your username for this account"
					placeholder="Your username"
					required
					radius="md"
					onChange={(e) => {
						setUsernameError("");
						setUsername(e.target.value);
					}}
					error={usernameError}
					leftSection={<IconUser />}
					autoComplete="username"
				/>
				<PasswordInput
					label="Digital Register password"
					description="This password is not stored anywhere and is only used for automatic onboarding logic"
					placeholder="Your password"
					required
					radius="md"
					onChange={(e) => {
						setRegisterPasswordError("");
						setRegisterPassword(e.target.value);
					}}
					error={registerPasswordError}
					leftSection={<IconKey />}
					autoComplete="current-password"
				/>
				<PasswordInput
					label="New password"
					description="This will become the new password for this account"
					placeholder="Your new password"
					required
					radius="md"
					onChange={(e) => {
						setnewAccountPasswordError("");
						setNewAccountPassword(e.target.value);
					}}
					error={newAccountPasswordError}
					leftSection={<IconKey />}
					autoComplete="new-password"
				/>
				<NativeSelect
					label="Your school name"
					required
					onChange={(e) => {
						setSchoolNameError("");
						setSchoolName(e.target.value);
					}}
					error={schoolNameError}
					leftSection={<IconSchool />}
					data={[
						{
							label: "WFO Bruneck",
							value: "https://wfo-bruneck.digitalesregister.it/",
						},
						"WFO Innichen",
					]}
					disabled={true}
				/>
				<Button fullWidth mt="sm" radius="md" type="submit">
					Create Account
				</Button>
				<Button
					fullWidth
					mt="xs"
					radius="md"
					component="a"
					href="/login"
					variant="outline">
					Back
				</Button>
			</Paper>
		</Container>
	);
}
