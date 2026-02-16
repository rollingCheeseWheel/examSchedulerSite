import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconMoon, IconSun, type ReactNode } from "@tabler/icons-react";

export function ThemeButton() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const actualColorScheme = useColorScheme();

	return (
		<ActionIcon onClick={toggleColorScheme} variant="subtle">
			{getActualIcon()}
		</ActionIcon>
	);

	function getActualIcon(): ReactNode {
		if (colorScheme === "dark") {
			return <IconSun />;
		} else if (colorScheme === "light") {
			return <IconMoon />;
		} else if (actualColorScheme === "dark") {
			return <IconSun />;
		} else {
			return <IconMoon />;
		}
	}
}
