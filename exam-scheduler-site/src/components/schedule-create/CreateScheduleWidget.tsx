import { Grid } from "@mantine/core";
import { useCalendar } from "../../zustand/zustand";
import type { Lesson } from "../../models/calendar";
import { groupBy, mapMap } from "../../util";

export interface CreateScheduleWidgetProps {}

export function CreateScheduleWidget(props: CreateScheduleWidgetProps) {
	const calendar = useCalendar((s) => s.data);

	const grouped = groupBy(
		calendar?.lessons ?? [],
		(i) => i.occurances.at(0)?.getDay() ?? Number.MIN_SAFE_INTEGER
	);

	return (
		<Grid justify="flex-start" align="flex-start">
			{...mapMap(grouped, (k, i) => CalendarDay(props, k, i))}
		</Grid>
	);
}

function CalendarDay(
	props: CreateScheduleWidgetProps,
	dayOfWeek: number,
	lessons: Lesson[]
) {
	return <Grid.Col>
	</Grid.Col>;
}
