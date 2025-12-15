import { Grid } from "@mantine/core";
import type { ScheduleProps } from "./StudentSchedule";
import StudentSchedule from "./StudentSchedule";

export default function ScheduleContainer(props: ScheduleProps[]) {
	return (
		<Grid>
			{props.map((p) => (
				<Grid.Col>{StudentSchedule(p)}</Grid.Col>
			))}
		</Grid>
	);
}
