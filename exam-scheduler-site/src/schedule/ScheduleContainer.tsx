import { Grid } from "@mantine/core";
import type { ScheduleProps } from "./Schedule";
import Schedule from "./Schedule";

export default function ScheduleContainer(props: ScheduleProps[]) {
	return (
		<Grid>
			{props.map((p) => (
				<Grid.Col>{Schedule(p)}</Grid.Col>
			))}
		</Grid>
	);
}
