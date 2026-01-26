import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
	Box,
	Collapse,
	Group,
	Text,
	ThemeIcon,
	UnstyledButton,
} from "@mantine/core";
import classes from "./LinkGroup.module.scss";
import { useNavigate } from "react-router-dom";

export interface NestedLinkProp {
	label: string;
	link: string;
}

export interface LinkGroupProp {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: React.FC<any>;
	label: string;
	initiallyOpened?: boolean;
	links?: NestedLinkProp[];
	defaultLink?: string;
}

export function LinkGroup({
	icon: Icon,
	label,
	initiallyOpened,
	links = [],
	defaultLink,
}: LinkGroupProp) {
	const navigate = useNavigate();

	const hasLinks = !defaultLink && links.length !== 0;
	const [opened, setOpened] = useState(
		(initiallyOpened && hasLinks) || false,
	);
	const items = (hasLinks ? links : []).map((link) => (
		<Text<"a">
			component="a"
			className={classes.link}
			href={link.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}>
			{link.label}
		</Text>
	));

	return (
		<>
			<UnstyledButton
				onClick={
					defaultLink ?
						() => navigate(defaultLink)
					:	() => setOpened((o) => !o)
				}
				className={classes.control}>
				<Group justify="space-between" gap={0}>
					<Box style={{ display: "flex", alignItems: "center" }}>
						<ThemeIcon variant="light" size={30}>
							{Icon && <Icon size={18} />}
						</ThemeIcon>
						<Box ml="md">{label}</Box>
					</Box>
					{hasLinks && (
						<IconChevronRight
							className={classes.chevron}
							stroke={1.5}
							size={16}
							style={{
								transform: opened ? "rotate(-90deg)" : "none",
							}}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ?
				<Collapse in={opened}>{items}</Collapse>
			:	null}
		</>
	);
}
