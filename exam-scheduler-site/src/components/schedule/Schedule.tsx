import {
	Group,
	Flex,
	Paper,
	Title,
	Space,
	Text,
	Radio,
	Stack,
	type StyleProp,
	CheckIcon,
	Kbd,
	Grid,
	ThemeIcon,
	Button,
} from "@mantine/core";
import type { Schedule, ExamSlot, ExamSlotId } from "../../models/schedule";
import { ScheduleProgress } from "../ExtendedProgessbar";
import { useState } from "react";
import type { UserProfile, UserProfileId } from "../../models/user";
import { formatDateTime } from "../../util";
import { useTranslation } from "react-i18next";
import { IconSettingsCheck, IconTransfer } from "@tabler/icons-react";

export interface ExamScheduleProps extends Schedule {
	maxwidth?: StyleProp<string | number>;
	teacher?: boolean;
	selectedSlotId?: ExamSlotId;
}

export function ExamSchedule(props: ExamScheduleProps) {
	const [checked, setChecked] = useState<ExamSlotId>(
		props.selectedSlotId ?? "",
	);

	function handleCheck(newId: ExamSlotId) {
		setChecked(newId);
	}

	return (
		<Paper maw={props.maxwidth} withBorder p="md" radius="md">
			<Group justify="space-between">
				<Title order={2}>{props.subjectName}</Title>
				<Text>{props.description}</Text>
			</Group>
			<Stack align="stretch" justify="flex-start" gap="xs">
				{...props.examSlots.map((s) =>
					ScheduleDate(s, props, handleCheck, checked),
				)}
			</Stack>
		</Paper>
	);
}

function ScheduleDate(
	props: ExamSlot,
	scheduleProps: ExamScheduleProps,
	setChecked: (checkedId: ExamSlotId) => void,
	checkedId: ExamSlotId,
) {
	const { i18n } = useTranslation();

	return (
		<>
			<Grid>
				<Grid.Col span="content">
					<Text>{formatDateTime(props.date, i18n.language)}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<ScheduleProgress
						participants={props.participants.length}
						min={props.minParticipants}
						max={props.maxParticipants}
						size="xl"
					/>
				</Grid.Col>
			</Grid>
			<Flex justify="space-between" /* direction="row-reverse" */>
				<Group gap="xs">
					{...props.participants.map((p) =>
						ScheduleParticipant(p, !scheduleProps.teacher),
					)}
				</Group>
				{/* <RegisterForSlotButton
					scheduleSlot={props}
					setChecked={setChecked}
					currentSelectedId={checkedId}
				/> */}

				<ScheduleRadio
					enabled={!scheduleProps.teacher}
					schedule={scheduleProps}
					scheduleSlot={props}
					setChecked={setChecked}
					checkedId={checkedId}
				/>
			</Flex>
		</>
	);
}

function ScheduleParticipant(user: UserProfile, enableSwap: boolean) {
	function handleClick() {
		if (!enableSwap) return;
	}
	return (
		<Button
			component={Kbd}
			variant="default"
			size="compact-md"
			onClick={handleClick}
		>
			{user.name}
		</Button>
	);
}

interface ScheduleRadioProps {
	scheduleSlot: ExamSlot;
	schedule: Schedule;
	setChecked: (id: ExamSlotId) => void;
	checkedId: ExamSlotId;
	enabled?: boolean;
}

function ScheduleRadio({
	scheduleSlot,
	schedule,
	setChecked,
	checkedId,
	enabled,
}: ScheduleRadioProps) {
	return (
		enabled && (
			<Radio
				icon={CheckIcon}
				name={schedule.id}
				onChange={() => setChecked(scheduleSlot.id)}
				checked={scheduleSlot.id == checkedId}
			/>
		)
	);
}

function RegisterForSlotButton(props: {
	scheduleSlot: ExamSlot;
	setChecked: (examSlotId: ExamSlotId) => void;
	showSwapOverlay: (slotId: ExamSlotId) => void;
	currentSelectedId: ExamSlotId;
	locked?: boolean;
	openForSwap?: boolean;
}) {
	const { t } = useTranslation();
	const thisScheduleId = props.scheduleSlot.id;

	const selected =
		thisScheduleId === props.currentSelectedId || !!props.locked;

	if (!selected && props.openForSwap) {
		return (
			<Button onClick={() => props.showSwapOverlay(thisScheduleId)}>
				{t("schedule.register.swap")}
			</Button>
		);
	} else if (selected) {
		return <Button disabled>{t("schedule.register.selected")}</Button>;
	} else {
		return (
			<Button onClick={() => props.setChecked(thisScheduleId)}>
				{t("schedule.register.unselected")}
			</Button>
		);
	}
}
