import {
	ActionIcon,
	Button,
	Center,
	Container,
	Grid,
	Group,
	Modal,
	NativeSelect,
	Stack,
	Text,
	type MantineColor,
} from "@mantine/core";
import { DatePickerInput, type DayOfWeek } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCalendar } from "../../../hooks/useCalendar";
import { usePromise } from "../../../hooks/usePromise";
import type { Lesson } from "../../../models/calendar";
import type { ClassroomId } from "../../../models/classroom";
import {
	compoundSort,
	getColorsForLessons,
	groupBy,
	mapKVPs,
	reduceMap,
	sort,
	type Action,
} from "../../../util";
import {
	useClassrooms,
	useLoadingOverlay,
	useScheduleHubConnection,
} from "../../../zustand/zustand";

export function ScheduleCreateModal(props: {
	opened: boolean;
	close: Action<[]>;
}) {
	const { t } = useTranslation();
	const scheduleHub = useScheduleHubConnection((s) => s.data);

	const {
		loading: lessonFetchLoading,
		resolve: resolveLessonPromise,
		abort: abortLessonFetch,
		data: lessons,
		getSignal,
	} = usePromise<Lesson[]>();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	useEffect(() => {
		setLoadingOverlayState(lessonFetchLoading);
		return abortLessonFetch;
	}, [abortLessonFetch, lessonFetchLoading, setLoadingOverlayState]);

	const [selectedWeek, setSelectedWeek] = useState<Date>();
	function incrementDate() {
		setSelectedWeek(
			selectedWeek ? new Date(selectedWeek.getDate() + 7) : undefined,
		);
		resolveLessonPromise(
			fetchWeek(selectedClassroomId, selectedWeek, getSignal()),
		);
	}
	function decrementDate() {
		setSelectedWeek(
			selectedWeek ? new Date(selectedWeek.getDate() - 7) : undefined,
		);
		resolveLessonPromise(
			fetchWeek(selectedClassroomId, selectedWeek, getSignal()),
		);
	}

	const classrooms = useClassrooms((s) => s.data);
	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>();
	const { fetchWeek } = useCalendar();

	const calendar = classrooms.find(
		(c) => c.id == selectedClassroomId,
	);
	const lessonColors = getColorsForLessons(lessons ?? []);
	const slots = (lessons ?? []).map<TimeTableSlot>((l) => ({
		name: l.subject.name,
		dayOfWeek: new Date(l.date).getDate() as DayOfWeek,
		start: l.fromHour,
		duration: l.toHour - l.fromHour,
		color: lessonColors[l.subject.name],
	}));

	function handleSubmit() {}

	return (
		<Modal
			centered
			size="lg"
			opened={props.opened}
			onClose={props.close}
			title={
				<Text fw={700} size="xl">
					{t("schedule.create.title")}
				</Text>
			}>
			<Stack>
				<NativeSelect
					required
					label={t("schedule.create.classroomselect")}
					value={selectedClassroomId}
					onChange={(e) =>
						setSelectedClassroom(e.currentTarget.value)
					}
					data={classrooms.map((c) => ({
						value: c.id,
						label: c.name,
					}))}
				/>
				{selectedClassroomId && (
					<>
						<DatePickerInput
							required
							label={t("schedule.create.datepick")}
							value={selectedWeek}
							onChange={(e) =>
								setSelectedWeek(e ? new Date(e) : undefined)
							}
						/>
						<Grid>
							<Grid.Col>
								<Center>
									<ActionIcon
										variant="default"
										onClick={decrementDate}>
										<IconChevronLeft />
									</ActionIcon>
								</Center>
							</Grid.Col>
							<Grid.Col>
								<TimeTable slots={slots} />
							</Grid.Col>
							<Grid.Col>
								<Center>
									<ActionIcon
										variant="default"
										onClick={incrementDate}>
										<IconChevronRight />
									</ActionIcon>
								</Center>
							</Grid.Col>
						</Grid>
					</>
				)}
				<Group>
					<Button onClick={props.close}>{t("common.cancel")}</Button>
					{selectedClassroomId && (
						<Button onClick={handleSubmit}>
							{t("common.submit")}
						</Button>
					)}
				</Group>
			</Stack>
		</Modal>
	);
}

interface TimeTableSlot {
	dayOfWeek: DayOfWeek;
	start: number;
	duration: number;
	name: string;
	color: MantineColor;
}

const timeTableSlotSorter = compoundSort<TimeTableSlot>(
	sort((x) => x.dayOfWeek),
	sort((x) => x.start),
	sort((x) => x.duration),
	sort((x) => x.name),
);

function TimeTable(props: { slots: TimeTableSlot[] }) {
	const groupedDays = mapKVPs(
		groupBy(props.slots, (s) => s.dayOfWeek),
		(slots) => slots.sort(timeTableSlotSorter),
	);
	const longestDay = Math.max(
		...reduceMap(
			groupedDays,
			(acc, curr) => acc + curr.duration,
			0,
		).values(),
	);
	const percentHeightPerHour = 100 / longestDay;

	return (
		<Grid>
			{Array.from(
				mapKVPs(groupedDays, (slots) => (
					<Grid.Col>
						{slots.map((s) => (
							<Container
								pos="absolute"
								top={`${s.start * percentHeightPerHour}%`}
								bg={s.color}
								h={`${s.duration * percentHeightPerHour}%`}>
								<Text>{s.name}</Text>
							</Container>
						))}
					</Grid.Col>
				)).values(),
			)}
		</Grid>
	);
}
