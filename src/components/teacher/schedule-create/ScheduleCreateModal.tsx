import {
	ActionIcon,
	Button,
	Flex,
	Group,
	LoadingOverlay,
	Modal,
	NativeSelect,
	Stack,
	Text,
} from "@mantine/core";
import { type DayOfWeek } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCalendar } from "../../../hooks/useCalendar";
import { usePromise } from "../../../hooks/usePromise";
import type { Lesson } from "../../../models/calendar";
import type { ClassroomId } from "../../../models/classroom";
import {
	addDaysToDate,
	equals,
	floorDateToMonday,
	getColorsForLessons,
	type Action,
} from "../../../util";
import {
	useClassrooms,
	useLoadingOverlay,
	useScheduleHubConnection,
} from "../../../zustand";
import { TimeRangeDisplay } from "../../common/TimeRangeDisplay";
import { TimeTable, type TimeTableSlot } from "./TimeTable";

export function ScheduleCreateModal(props: {
	opened: boolean;
	close: Action<[]>;
}) {
	const { t } = useTranslation();
	const scheduleHub = useScheduleHubConnection((s) => s.data);
	const [loadingOverlayState, setLoadingOverlayState] = useState(false);
	const fetchLessons = useCalendar();

	const classrooms = useClassrooms((s) => s.asArray);
	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>();
	const selectedClassroom = classrooms.find(
		equals((c) => c.id, selectedClassroomId),
	);

	const {
		loading: lessonFetchLoading,
		resolve: resolveLessonPromise,
		abort: abortLessonFetch,
		data: lessons,
		getSignal,
	} = usePromise<void>();
	useEffect(() => {
		setLoadingOverlayState(lessonFetchLoading);
		return abortLessonFetch;
	}, [abortLessonFetch, lessonFetchLoading, setLoadingOverlayState]);

	useEffect(() => {
		if (!selectedClassroomId) return;
		console.log("fetching calendar");
		resolveLessonPromise(
			fetchLessons(selectedClassroomId, new Date(Date.now())),
		);
		return abortLessonFetch;
	}, [
		abortLessonFetch,
		fetchLessons,
		resolveLessonPromise,
		selectedClassroomId,
	]);

	const minDate = floorDateToMonday(new Date(Date.now()));
	const [selectedWeek, setSelectedWeek] = useState<Date>(
		floorDateToMonday(new Date(Date.now())),
	);
	function incrementDate() {
		console.log("fetching calendar");
		setSelectedWeek(addDaysToDate(selectedWeek, 7));
		resolveLessonPromise(
			fetchLessons(selectedClassroomId, selectedWeek, getSignal()),
		);
	}
	function decrementDate() {
		if (selectedWeek.getTime() <= minDate.getTime()) {
			return;
		}
		console.log("fetching calendar");
		setSelectedWeek(addDaysToDate(selectedWeek, -7));
		resolveLessonPromise(
			fetchLessons(selectedClassroomId, selectedWeek, getSignal()),
		);
	}

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
			<LoadingOverlay visible={loadingOverlayState} zIndex={6767} />
			<Stack>
				<NativeSelect
					required
					label={t("schedule.create.classroomselect")}
					value={selectedClassroomId}
					onChange={(e) => setSelectedClassroom(e.currentTarget.value)}
					data={[
						{
							value: "",
							label: "",
						},
						...classrooms.map((c) => ({
							value: c.id,
							label: c.name,
						})),
					]}
				/>
				{selectedClassroomId && (
					<>
						<TimeRangeDisplay
							startDate={selectedWeek}
							endDate={addDaysToDate(selectedWeek, 7)}
						/>
						<Flex align="center" justify="center">
							<ActionIcon variant="default" onClick={decrementDate}>
								<IconChevronLeft />
							</ActionIcon>
							<TimeTable
								totalStudentCount={selectedClassroom?.studentCount}
							/>
							<ActionIcon variant="default" onClick={incrementDate}>
								<IconChevronRight />
							</ActionIcon>
						</Flex>
					</>
				)}
				<Group>
					<Button onClick={props.close}>{t("common.cancel")}</Button>
					{selectedClassroomId && (
						<Button onClick={handleSubmit}>{t("common.submit")}</Button>
					)}
				</Group>
			</Stack>
		</Modal>
	);
}
