import {
	Box,
	Center,
	Container,
	NumberInput,
	SimpleGrid,
	Stack,
	Text,
	type MantineColor,
} from "@mantine/core";
import {
	equals,
	getColorsForLessons,
	groupBy,
	mapKVPs,
	reduceMap,
	timeTableSlotSorter,
	type Action,
} from "../../../util";
import type {
	DayOfWeek,
	Lesson,
	SubjectName,
} from "./../../../models/calendar";
import { useLessonWeeks } from "../../../zustand";

export interface TimeTableSlot {
	dayOfWeek: DayOfWeek;
	start: number;
	duration: number;
	label: SubjectName;
	color: MantineColor;
}

export function TimeTable(props: {
	date: string | number | Date;
	targetSubject: SubjectName;
	setOccurance: Action<[DayOfWeek, number]>;
	totalStudentCount?: number;
}) {
	const lessons = useLessonWeeks((s) => s.get)(new Date(props.date).getTime()) ?? [];

	const lessonColors = getColorsForLessons(lessons);
	const slots = lessons.map<TimeTableSlot>((l) => ({
		label: l.subject.name,
		dayOfWeek: new Date(l.date).getDate() as DayOfWeek,
		start: l.fromHour,
		duration: l.toHour - l.fromHour,
		color: lessonColors[l.subject.name],
	}));

	const groupedDays = mapKVPs(
		groupBy(slots, (s) => s.dayOfWeek),
		(slots) => slots.sort(timeTableSlotSorter),
	);
	const longestDay = Math.max(
		...reduceMap(groupedDays, (acc, curr) => acc + curr.duration, 0).values(),
	);
	const percentHeightPerHour = 100 / longestDay;
	const percentWidthPerDay = `${100 / groupedDays.size}%`;

	return (
		<SimpleGrid
			cols={groupedDays.size}
			h="100%"
			w="100%"
			pos="relative"
			spacing={0}>
			{Array.from(
				mapKVPs(groupedDays, (slots, dayOfWeek) => (
					<Stack>
						<Container>
							{slots.map((s) => (
								<Box
									pos="absolute"
									top={`${s.start * percentHeightPerHour}%`}
									bg={s.color}
									h={`${s.duration * percentHeightPerHour}%`}
									w={percentWidthPerDay}>
									<Center>
										<Text truncate="end">{s.label}</Text>
									</Center>
								</Box>
							))}
						</Container>
						{slots.some(equals((s) => s.label, props.targetSubject)) && (
							<NumberInput
								allowDecimal={false}
								allowNegative={false}
								allowLeadingZeros={false}
								defaultValue={0}
								min={0}
								max={props.totalStudentCount}
								onChange={(value) =>
									props.setOccurance(
										dayOfWeek,
										typeof value == "number" ? value : parseInt(value),
									)
								}
							/>
						)}
					</Stack>
				)).values(),
			)}
		</SimpleGrid>
	);
}
