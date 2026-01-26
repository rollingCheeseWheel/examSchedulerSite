import { useNavbarMenu } from "../../zustand/zustand";
import { LinkGroup } from "./LinkGroup";
import classes from "./NestedNavbar.module.css";
import { ScrollArea } from "@mantine/core";

export function NestedNavbar() {
	const data = useNavbarMenu(s => s.data);
	const links = (data ?? []).map((item) => (
		<LinkGroup {...item} key={item.label} />
	));

	return (
		<nav className={classes.navbar}>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>
		</nav>
	);
}
