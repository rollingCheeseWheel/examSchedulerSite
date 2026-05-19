import { Button, Modal, NativeSelect, Stack, Text } from "@mantine/core";
import "@mantine/code-highlight/styles.css";
import { CodeHighlight } from "@mantine/code-highlight";
import { equals, type Action } from "../../../util";
import { useEffect, useState } from "react";
import type { SubjectName, TeacherName } from "../../../models/calendar";
import { useTranslation } from "react-i18next";
import {
	useClassrooms,
	useHubConnection,
	useLoadingOverlay,
	useUserProfile,
} from "../../../hooks/zustand";
import { useLoadingPromise } from "../../../hooks/useLoadingPromise";
import { useCalendar } from "../../../hooks/useCalendar";
import type { ClassroomId } from "../../../models/classroom";
import type { ScheduleCreateRequest } from "../../../models/schedule";

export function TemporaryCreateModal(props: {
	opened: boolean;
	close: Action<[]>;
}) {
	const { t } = useTranslation();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const userProfile = useUserProfile((s) => s.data);
	const { resolve, abort } = useLoadingPromise({
		onLoading: setLoadingOverlayState,
	});
	const fetchTimeTable = useCalendar();

	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>();
	const classrooms = useClassrooms((s) => s.asArray);
	const selectedClassroom = classrooms.find(
		equals((c) => c.id, selectedClassroomId),
	);

	const selectedSubject =
		(selectedClassroom?.teachers ?? [])
			.find(equals((t) => t.name, userProfile?.name as TeacherName | undefined))
			?.subjects.at(0)?.name ?? "";

	const connection = useHubConnection((s) => s.data);

	useEffect(
		() => {
			resolve(fetchTimeTable(selectedClassroomId, new Date(2026, 4, 19)), {
				onSuccess: (res) => console.log("lessons", res),
			});
			return abort;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const request: ScheduleCreateRequest = {
		classroomId: selectedClassroomId ?? "",
		generator: {
			slots: [{
				maxParticipants: 6,
				dayOfWeek: 2,
			},
			{
				maxParticipants: 7,
				dayOfWeek: 3,
			},],
			blacklistedDays: []
		},
		subjectName: selectedSubject,
		description: "Anlagenbuchhaltung",
		startDate: new Date(2026, 4, 19),
		lockInOffset: new Date(0),
	};

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
				{/* <NativeSelect
					required
					label={t("schedule.create.subjectSelect")}
					value={selectedSubject}
					onChange={(e) => setSelectedSubject(e.currentTarget.value)}
					data={(selectedClassroom?.teachers ?? [])
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
				/> */}

				<CodeHighlight code={JSON.stringify(request, null, 2)} lang="json" />
				<Button
					onClick={() => {
						console.log("sent request", connection);
						resolve(connection?.createSchedule(request), {
							onSuccess: (res) => console.log("create schedule result", res),
						});
					}}>
					{t("submit")}
				</Button>
			</Stack>
		</Modal>
	);
}
