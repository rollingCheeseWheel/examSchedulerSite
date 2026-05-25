import {
	Button,
	Center,
	Checkbox,
	CheckboxGroup,
	Divider,
	MantineProvider,
	Modal,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePromise } from "../../../hooks/usePromise";
import {
	useClassrooms,
	useHubConnection,
	useSchedules,
} from "../../../hooks/zustand";
import type { ExamSlotId } from "../../../models/schedule";
import type { UserProfileId } from "../../../models/user";
import { pointerCursorTheme, type Action } from "../../../util";

export function ReportStudentModal(props: {
	slotId: ExamSlotId;
	opened: boolean;
	onClose: Action<[]>;
}) {
	const { t } = useTranslation();
	const { resolve } = usePromise({
		onError: console.error,
		onSuccess: console.log,
	});

	const _connection = useHubConnection((s) => s.data);
	const connectionRef = useRef(_connection);
	useEffect(() => {
		connectionRef.current = _connection;
	}, [_connection]);

	const schedule = useSchedules((s) => s.asArray).find((s) =>
		s.examSlots.some((s) => s.id == props.slotId),
	);
	const takenStudentIds = schedule?.examSlots
		.filter((s) => s.lockState == "definite")
		.map((s) => s.participants)
		.flat()
		.map((s) => s.id);
	const classroomsMap = useClassrooms((s) => s.asMap);
	const availableStudents = classroomsMap
		.get(schedule?.classroomId ?? "")
		?.students.filter((s) => !takenStudentIds?.includes(s.id));

	const [checkedStudents, setCheckedStudents] = useState<UserProfileId[]>([]);

	const examslot = schedule?.examSlots.find((s) => s.id == props.slotId);

	useEffect(() => {
		setCheckedStudents(examslot?.participants.map((p) => p.id) ?? []);
	}, [examslot?.participants]);

	if (!schedule || !examslot || !availableStudents) {
		return;
	}

	if (availableStudents.length === 0) {
		return (
			<Modal
				title={
					<Text size="xl" fw={700}>
						{t("studentmodal.title")}
					</Text>
				}
				opened={props.opened}
				onClose={props.onClose}
				centered>
				<Text>{t("studentmodal.zerostudents")}</Text>
			</Modal>
		);
	}

	return (
		<Modal
			title={
				<Text size="xl" fw={700}>
					{t("studentmodal.title")}
				</Text>
			}
			opened={props.opened}
			onClose={props.onClose}
			centered>
			<Stack mah="60vh">
				<Text>{t("studentmodal.usage")}</Text>

				<MantineProvider theme={pointerCursorTheme}>
					<ScrollArea type="auto" h="100vh" overscrollBehavior="contain">
						<CheckboxGroup
							value={checkedStudents}
							onChange={setCheckedStudents}
							defaultValue={examslot.participants.map((p) => p.id)}>
							<Stack>
								{examslot.participants.length && (
									<>
										{...examslot.participants.map((p) => (
											<Checkbox value={p.id} label={p.name} />
										))}
										{examslot.participants.length && <Divider />}
									</>
								)}
								{...availableStudents.map((p) => (
									<Checkbox value={p.id} label={p.name} />
								))}
							</Stack>
						</CheckboxGroup>
					</ScrollArea>
				</MantineProvider>

				<Center>
					<Button
						onClick={() =>
							resolve(
								connectionRef.current?.reportStudents(
									props.slotId,
									checkedStudents,
								) ?? Promise.reject(),
							)
						}>
						<Text>{t("studentmodal.submit")}</Text>
					</Button>
				</Center>
			</Stack>
		</Modal>
	);
}
