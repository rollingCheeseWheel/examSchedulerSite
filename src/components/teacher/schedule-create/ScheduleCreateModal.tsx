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
	TextInput,
} from "@mantine/core";
import { DatePickerInput, TimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "@mantine/dates/styles.layer.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCalendar } from "../../../hooks/useCalendar";
import { usePromise } from "../../../hooks/usePromise";
import {
	useClassrooms,
	useScheduleHubConnection,
	useUserProfile,
} from "../../../hooks/zustand";
import type {
	DayOfWeek,
	Lesson,
	SubjectName,
	TeacherName,
} from "../../../models/calendar";
import type { ClassroomId } from "../../../models/classroom";
import type { Result } from "../../../models/result";
import type { ScheduleGeneratorSlot } from "../../../models/schedule";
import {
	addDaysToDate,
	equals,
	floorDateToMonday,
	mapKVPs,
	type Action,
} from "../../../util";
import { TimeRangeDisplay } from "../../common/TimeRangeDisplay";
import { TimeTable } from "./TimeTable";

export function ScheduleCreateModal(props: {
	opened: boolean;
	close: Action<[]>;
}) {
	const { t } = useTranslation();
	const userProfile = useUserProfile((s) => s.data);
	const [loadingOverlayState, setLoadingOverlayState] = useState(false);

	const form = useForm({
		mode: "controlled",
		initialValues: {
			classroom: "",
			description: "",
			startDate: "",
			lockinOffset: "",
		},
		validate: {
			classroom: isNotEmpty(t("schedule.create.error.classroom")),
			startDate: isNotEmpty(t("schedule.create.error.startdate")),
		},
	});

	const descriptionRef = useRef<HTMLInputElement>(null);
	const [startDate, setStartDate] = useState<string | null>();
	const [lockinOffset, setLockinOffset] = useState<string>();

	const scheduleHub = useScheduleHubConnection((s) => s.data);
	const { resolve: resolveScheduleCreate } = usePromise<Result<boolean>>({
		onLoading: setLoadingOverlayState,
	});

	const classrooms = useClassrooms((s) => s.asArray);
	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>();
	const selectedClassroom = classrooms.find(
		equals((c) => c.id, selectedClassroomId),
	);

	const [selectedSubject, setSelectedSubject] = useState<SubjectName>();

	const [occurances, setOccurances] = useState<Map<DayOfWeek, number>>(
		new Map(),
	);
	const setSpecificOccurance = useCallback(
		(dayOfWeek: DayOfWeek, count: number) => {
			setOccurances((s) => s.set(dayOfWeek, count));
		},
		[setOccurances],
	);

	const fetchLessons = useCalendar();
	const {
		resolve: resolveLessonPromise,
		abort: abortLessonFetch,
		getSignal,
		data: lessons,
	} = usePromise<Lesson[]>({ onLoading: setLoadingOverlayState });

	useEffect(() => {
		if (!selectedClassroomId) return;
		setOccurances(new Map());
		setSelectedWeek(floorDateToMonday(Date.now()));
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
	const incrementDate = useCallback(() => {
		setSelectedWeek(addDaysToDate(selectedWeek, 7));
		resolveLessonPromise(
			fetchLessons(selectedClassroomId, selectedWeek, getSignal()),
		);
	}, [
		fetchLessons,
		getSignal,
		resolveLessonPromise,
		selectedClassroomId,
		selectedWeek,
	]);
	const decrementDate = useCallback(() => {
		if (selectedWeek.getTime() <= minDate.getTime()) {
			return;
		}
		setSelectedWeek(addDaysToDate(selectedWeek, -7));
		resolveLessonPromise(
			fetchLessons(selectedClassroomId, selectedWeek, getSignal()),
		);
	}, [
		fetchLessons,
		getSignal,
		minDate,
		resolveLessonPromise,
		selectedClassroomId,
		selectedWeek,
	]);

	function handleSubmit() {
		if (
			!selectedClassroomId ||
			!selectedSubject ||
			!startDate ||
			isNaN(new Date(startDate).getTime())
		) {
			return;
		}

		resolveScheduleCreate(
			scheduleHub?.createSchedule({
				classroomId: selectedClassroomId,
				subjectName: selectedSubject,
				generatorSlots: Array.from(
					mapKVPs(
						occurances,
						(v, k) =>
							({ offset: k, maxParticipants: v }) as ScheduleGeneratorSlot,
					).values(),
				),
				description: descriptionRef.current?.value,
				startDate: new Date(startDate),
				lockInOffset:
					!lockinOffset || isNaN(new Date(lockinOffset).getTime()) ?
						new Date(0)
					:	new Date(lockinOffset),
			}),
		);
	}

	return (
		<Modal
			centered
			size="xl"
			opened={props.opened}
			onClose={props.close}
			title={
				<Text fw={700} size="xl">
					{t("schedule.create.title")}
				</Text>
			}>
			<LoadingOverlay visible={loadingOverlayState} zIndex={6767} />
			<form>
				<Stack>
					<NativeSelect
						required
						label={t("schedule.create.classroomSelect")}
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
					{selectedClassroom && (
						<>
							<Group grow>
								<NativeSelect
									required
									label={t("schedule.create.subjectSelect")}
									value={selectedSubject}
									onChange={(e) => setSelectedSubject(e.currentTarget.value)}
									data={selectedClassroom.teachers
										.find(
											equals(
												(t) => t.name,
												userProfile?.name as TeacherName | undefined,
											),
										)
										?.subjects.map((s) => ({
											label: s.name,
											value: s.name,
										}))}
								/>
								<DatePickerInput
									required
									label={t("schedule.create.startDatePicker")}
									value={startDate}
									onChange={setStartDate}
								/>
								<TimePicker
									label={t("schedule.create.lockinOffset")}
									value={lockinOffset}
									onChange={setLockinOffset}
								/>
							</Group>
							<TextInput
								label={t("schedule.create.scheduleDescription")}
								ref={descriptionRef}
							/>
						</>
					)}

					{selectedClassroomId && selectedSubject && lessons && (
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
									lessons={lessons}
									targetSubject={selectedSubject}
									setOccurance={setSpecificOccurance}
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
			</form>
		</Modal>
	);
}
