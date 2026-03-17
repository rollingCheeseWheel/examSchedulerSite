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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePromise } from "../../../hooks/usePromise";
import type { Result } from "../../../models/result";
import type { ExamSlotId } from "../../../models/schedule";
import type { UserProfileId } from "../../../models/user";
import { pointerCursorTheme, sleep, type Action } from "../../../util";
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
	const { loading, resolve, abort } = usePromise<Result<boolean>>();
	useEffect(() => {
		setLoadingOverlayState(loading);
		return abort;
	}, [abort, loading, setLoadingOverlayState]);

	const scheduleHub = useScheduleHubConnection((s) => s.data);
	const [checkedStudents, setCheckedStudents] = useState<UserProfileId[]>([]);

	const schedule = useSchedules((s) => s.data).find((s) =>
		s.examSlots.some((s) => s.id == props.slotId),
	);
	const examslot = schedule?.examSlots.find((s) => s.id == props.slotId);

	useEffect(() => {
		setCheckedStudents(examslot?.participants.map((p) => p.id) ?? []);
	}, [examslot?.participants]);

	const studentsInLockedSlots = schedule?.examSlots
		.filter((s) => s.lockState === "definite")
		.flatMap((s) => s.participants);
	const availableStudents = schedule?.examSlots
		.flatMap((s) => s.participants)
		.filter((p) => !examslot?.participants?.map((x) => x.id).includes(p.id))
		.filter((p) => !studentsInLockedSlots?.map((x) => x.id).includes(p.id));

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
								{...examslot.participants.map((p) => (
									<Checkbox value={p.id} label={p.name} />
								))}
								{examslot.participants.length && <Divider />}
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
								scheduleHub?.reportStudents(props.slotId, checkedStudents) ??
									sleep(250),
							)
						}>
						<Text>{t("studentmodal.submit")}</Text>
					</Button>
				</Center>
			</Stack>
		</Modal>
	);
}
