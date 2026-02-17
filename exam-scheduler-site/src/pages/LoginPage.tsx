import { Center } from "@mantine/core";
import { AppShellSpine } from "../components/common/appshell/AppShellSpine";
import { AuthWidget } from "../components/common/auth/AuthWidget";

export function LoginPage() {
	return (
		<AppShellSpine navbarDisabled>
			<></>
			<Center
				style={{
					height: "80dvh",
					overflow: "hidden",
				}}>
				<AuthWidget />
			</Center>
		</AppShellSpine>
	);
}
