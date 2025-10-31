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
	}

	return (
		<Container size={420} my={40}>
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
				/>
				<NativeSelect
					label="Your school name"
					required
					onChange={(e) => {
						setSchoolNameError("");
						setSchoolName(e.target.value);
					}}
					error={schoolNameError}
				/>
				<Button fullWidth mt="sm" radius="md" onClick={handleSignUp}>
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
