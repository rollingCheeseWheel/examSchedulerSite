import {
	Button,
	Center,
	Checkbox,
	CheckboxGroup,
	Container,
	Modal,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePromise } from "../../../hooks/usePromise";
import type { Result } from "../../../models/result";
import type { ExamSlotId } from "../../../models/schedule";
import type { UserProfileId } from "../../../models/user";
import type { Action } from "../../../util";
import {
	useLoadingOverlay,
	useScheduleHubConnection,
	useSchedules,
} from "../../../zustand/zustand";

export function ReportStudentModal(props: {
	slotId: ExamSlotId;
	opened: boolean;
	onClose: Action<[]>;
}) {
	const { t } = useTranslation();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const scheduleHub = useScheduleHubConnection((s) => s.data);
	const { loading, resolve } = usePromise<Result<boolean>>();
	const [checkedStudents, setCheckedStudents] = useState<UserProfileId[]>([]);
	const schedule = useSchedules((s) => s.data).find((s) =>
		s.examSlots.some((s) => s.id == props.slotId),
	);
	const examslot = schedule?.examSlots.find((s) => s.id == props.slotId);
	const totalParticipants = schedule?.examSlots.flatMap((s) => s.participants);

	function handleSubmit() {
		resolve(scheduleHub?.ReportStudents(props.slotId, checkedStudents));
	}

	useEffect(
		() => setLoadingOverlayState(loading),
		[loading, setLoadingOverlayState],
	);

	if (!schedule || !examslot || !totalParticipants) {
		return;
	}

	if (totalParticipants.length === 0) {
		return (
			<Modal
				title={t("studentmodal.title")}
				opened={props.opened}
				onClose={props.onClose}
				centered>
				<Text>{t("studentmodal.zerostudents")}</Text>
			</Modal>
		);
	}

	return (
		<Modal
			title={t("studentmodal.title")}
			opened={props.opened}
			onClose={props.onClose}
			centered
			size="auto">
			<Text>{t("studentmodal.usage")}</Text>
			<Container mah="75vh">
				<ScrollArea>
					<CheckboxGroup
						value={checkedStudents}
						onChange={setCheckedStudents}
						defaultValue={examslot.participants.map((p) => p.id)}>
						<Stack>
							{...totalParticipants.map((p) => (
								<Checkbox value={p.id} label={p.name} />
							))}
						</Stack>
					</CheckboxGroup>
				</ScrollArea>
			</Container>
			<Center>
				<Button onClick={handleSubmit}>
					<Text>{t("studentmodal.submit")}</Text>
				</Button>
			</Center>
		</Modal>
	);
}
