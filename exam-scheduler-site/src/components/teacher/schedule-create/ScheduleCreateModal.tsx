import {
	Button,
	Container,
	Grid,
	Group,
	Modal,
	NativeSelect,
	Stack,
	Text,
	type MantineColor,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePromise } from "../../../hooks/usePromise";
import type { DayOfWeek } from "../../../models/calendar";
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

	const { loading, resolve, abort } = usePromise();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	useEffect(() => {
		setLoadingOverlayState(loading);
		return abort;
	}, [abort, loading, setLoadingOverlayState]);

	const [startDate, setStartDate] = useState<string | null>();

	const classrooms = useClassrooms((s) => s.data);
	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>();

	const calendar = classrooms.find(
		(c) => c.id == selectedClassroomId,
	)?.calendar;
	const lessonColors = getColorsForLessons(calendar?.lessons ?? []);
	const slots = (calendar?.lessons ?? []).map<TimeTableSlot>((l) => ({
		name: l.subject.name,
		dayOfWeek: l.dayOfWeek,
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
							value={startDate}
							onChange={setStartDate}
						/>
						<TimeTable slots={slots} />
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
								top={`${s.start * percentHeightPerHour}%`}
								bg={s.color}
								mah={`${s.duration * percentHeightPerHour}%`}>
								<Text>{s.name}</Text>
							</Container>
						))}
					</Grid.Col>
				)).values(),
			)}
		</Grid>
	);
}
