import { LinksGroup, type LinkGroupProp } from "./LinkGroup";
import classes from "./NestedNavbar.module.css";
import { ScrollArea } from "@mantine/core";

export function NestedNavbar({ data }: { data?: LinkGroupProp[] }) {
	const links = (data ?? []).map((item) => (
		<LinksGroup {...item} key={item.label} />
	));

	return (
		<nav className={classes.navbar}>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>
		</nav>
	);
}
