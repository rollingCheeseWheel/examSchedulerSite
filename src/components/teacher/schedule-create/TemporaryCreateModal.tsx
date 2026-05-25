import { CodeHighlight } from "@mantine/code-highlight";
import "@mantine/code-highlight/styles.css";
import { Button, Modal, NativeSelect, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePromise } from "../../../hooks/usePromise";
import {
	useClassrooms,
	useHubConnection,
	useUserProfile,
} from "../../../hooks/zustand";
import { api } from "../../../main";
import type { Lesson, TeacherName } from "../../../models/calendar";
import type { ClassroomId } from "../../../models/classroom";
import type { Result } from "../../../models/result";
import type {
	ExamSlotId,
	ScheduleCreateRequest,
} from "../../../models/schedule";
import { equals, type Action } from "../../../util";

export function TemporaryCreateModal(props: {
	opened: boolean;
	close: Action<[]>;
}) {
	const { t } = useTranslation();
	const userProfile = useUserProfile((s) => s.data);
	const { resolve } = usePromise({
		onError: console.error,
		onSuccess: console.log,
	});

	const fetchLessons = useCallback(
		(classroomId?: ClassroomId, date?: Date, signal?: AbortSignal) => {
			if (!classroomId || !date) {
				return;
			}
			return api<Result<Lesson[]>>(
				`api/calendar/${classroomId}/${date.getTime()}`,
				{ signal, method: "GET" },
			);
		},
		[],
	);

	const classrooms = useClassrooms((s) => s.asArray);
	const [selectedClassroomId, setSelectedClassroom] = useState<ClassroomId>(
		classrooms.at(0)?.id ?? "",
	);
	const selectedClassroom = classrooms.find(
		equals((c) => c.id, selectedClassroomId),
	);

	const selectedSubject =
		(selectedClassroom?.teachers ?? [])
			.find(equals((t) => t.name, userProfile?.name as TeacherName | undefined))
			?.subjects.at(0)?.name ?? "";

	const connection = useHubConnection((s) => s.data);

	useEffect(() => {
		resolve(fetchLessons(selectedClassroomId, new Date()));
	}, [fetchLessons, resolve, selectedClassroomId]);

	const request: ScheduleCreateRequest = {
		classroomId: selectedClassroomId ?? "",
		generator: {
			slots: [
				{
					maxParticipants: 6,
					dayOfWeek: 2,
				},
				{
					maxParticipants: 7,
					dayOfWeek: 3,
				},
			],
			blacklistedDays: [],
		},
		subjectName: selectedSubject,
		description: "Anlagenbuchhaltung",
		startDate: "2026-05-10",
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
					value={selectedClassroomId ?? classrooms.at(0)?.id}
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

				<CodeHighlight code={JSON.stringify(request, null, 2)} lang="json" />
				<Button
					onClick={() => {
						resolve(connection?.createSchedule(request), {
							onSuccess: () => {
									notifications.show({
										message: t("schedule.create.success"),
									});
									props.close();
							},
						});
					}}>
					{t("submit")}
				</Button>
				<Button
					onClick={() =>
						resolve(
							connection?.registerForSlot(
								(selectedClassroomId ?? "") as ExamSlotId,
							),
						)
					}>
					test
				</Button>
			</Stack>
		</Modal>
	);
}
