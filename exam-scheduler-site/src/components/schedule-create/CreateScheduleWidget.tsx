import { Grid, Stack, Tooltip } from "@mantine/core";
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Lesson } from "../../models/calendar";
import { groupBy, mapMap } from "../../util";
import { useCalendar } from "../../zustand/zustand";

export function CreateScheduleWidget() {
	const calendar = useCalendar((s) => s.data);
	const [page, setPage] = useState(new Date());

	const grouped = groupBy(
		calendar?.lessons ?? [],
		(i) => i.occurances.at(0)?.getDay() ?? Number.MIN_SAFE_INTEGER
	);

	return CalendarSkeleton(
		mapMap(grouped, (k, i) => CalendarDay(i, k, page)),
		page,
		setPage
	);
}
function CalendarSkeleton(
	children: ReactNode[],
	currentPage: Date,
	setPage: (date: Date) => void
) {
	const { t } = useTranslation();

	const weekInMilliseconds = 1000 * 60 * 60 * 24 * 7;
	const increment = () =>
		setPage(new Date(currentPage.getTime() + weekInMilliseconds));
	const decrement = () =>
		setPage(new Date(currentPage.getTime() - weekInMilliseconds));

	return (
		<Grid justify="flex-start" align="flex-start">
			<Grid.Col>
				<Tooltip label={t("schedule.create.calendar.decrement")}>
					<Stack justify="center">
						{/* <ActionIcon onClick={decrement} variant="transparent"> */}
						<IconArrowBigLeft onClick={decrement} />
						{/* </ActionIcon> */}
					</Stack>
				</Tooltip>
			</Grid.Col>
			{...children}
			<Grid.Col>
				<Stack justify="center">
					<Tooltip label={t("schedule.create.calendar.increment")}>
						{/* <ActionIcon onClick={increment} variant="transparent"> */}
						<IconArrowBigRight onClick={increment} />
						{/* </ActionIcon> */}
					</Tooltip>
				</Stack>
			</Grid.Col>
			<Grid.Col></Grid.Col>
		</Grid>
	);
}

function CalendarDay(_lessons: Lesson[], _dayOfWeek: number, _week: Date) {
	return <Grid.Col></Grid.Col>;
}
