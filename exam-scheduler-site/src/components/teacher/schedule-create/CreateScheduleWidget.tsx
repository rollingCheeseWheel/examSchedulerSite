import {
	Button,
	Center,
	Container,
	Grid,
	Space,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Lesson } from "../../../models/calendar";
import type { ClassroomId } from "../../../models/classroom";
import {
	getColorsForLessons,
	groupBy,
	mapMap,
	type Action,
	type LessonColors,
} from "../../../util";
import {
	useClassrooms,
	useScheduleHubConnection,
} from "../../../zustand/zustand";

export function CreateScheduleWidget({
	classroomId,
}: {
	classroomId?: ClassroomId;
}) {
	const scheduleHub = useScheduleHubConnection((s) => s.data);
	const { t } = useTranslation();

	const classrooms = useClassrooms((s) => s.data);
	const [selectedWeek, setSelectedWeek] = useState(new Date());

	const calendar = classrooms.find((c) => c.id === classroomId)?.calendar;
	if (!calendar || !classroomId) {
		return;
	}

	const lessonColors = getColorsForLessons(calendar);

	const grouped = groupBy(
		calendar?.lessons ?? [],
		(i) => i.occurances.at(0)?.getDay() ?? Number.MIN_SAFE_INTEGER,
	);

	function handleClick() {
		// scheduleHub?.CreateSchedule()
	}

	return (
		<>
			<CalendarSkeleton
				setPage={setSelectedWeek}
				selectedWeek={selectedWeek}>
				<></>
				<Grid>
					{...mapMap(grouped, (_, lessons) => (
						<Grid.Col>
							<CalendarDay
								lessons={lessons.sort()}
								selectedWeek={selectedWeek}
								lessonColors={lessonColors}
							/>
						</Grid.Col>
					))}
				</Grid>
			</CalendarSkeleton>
			<Center>
				<Button onClick={handleClick}>
					{t("schedule.create.submit")}
				</Button>
			</Center>
		</>
	);
}
function CalendarSkeleton(props: {
	children: ReactNode[];
	selectedWeek: Date;
	setPage: Action<[Date]>;
}) {
	const { t } = useTranslation();

	const weekInMilliseconds = 1000 * 60 * 60 * 24 * 7;
	const increment = () =>
		props.setPage(
			new Date(props.selectedWeek.getTime() + weekInMilliseconds),
		);
	const decrement = () =>
		props.setPage(
			new Date(props.selectedWeek.getTime() - weekInMilliseconds),
		);

	return (
		<Grid justify="flex-start" align="flex-start">
			<Grid.Col>
				<Tooltip label={t("schedule.create.calendar.decrement")}>
					<Stack justify="center">
						<IconArrowBigLeft onClick={decrement} />
					</Stack>
				</Tooltip>
			</Grid.Col>
			{...props.children}
			<Grid.Col>
				<Stack justify="center">
					<Tooltip label={t("schedule.create.calendar.increment")}>
						<IconArrowBigRight onClick={increment} />
					</Tooltip>
				</Stack>
			</Grid.Col>
			<Grid.Col></Grid.Col>
		</Grid>
	);
}

function CalendarDay(props: {
	lessons: Lesson[];
	selectedWeek: Date;
	lessonColors: LessonColors;
}) {
	const selectedLessons = props.lessons
		.filter((l) => l.occurances.includes(props.selectedWeek))
		.sort((a, b) => a.fromHour - b.fromHour);

	return (
		<Stack>
			{...selectedLessons.map((l) => (
				<CalendarDayLesson
					lesson={l}
					lessonColors={props.lessonColors}
				/>
			))}
		</Stack>
	);
}

function CalendarDayLesson(props: {
	lesson: Lesson;
	lessonColors: LessonColors;
}) {
	const lessonSegments: ReactNode[] = [];

	for (let i = 0; i < props.lesson.toHour - props.lesson.fromHour; i++) {
		lessonSegments.push(
			<Container>
				{i == 0 && <Text>{props.lesson.subject.name}</Text>}
				<Space />
			</Container>,
		);
	}

	return (
		<Container color={props.lessonColors[props.lesson.subject.name]}>
			{...lessonSegments}
		</Container>
	);
}
