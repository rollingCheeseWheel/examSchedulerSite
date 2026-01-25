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
} from "@mantine/core";
import type { Schedule, ExamSlot, ExamSlotId } from "../../models/schedule";
import { ScheduleProgress } from "../ExtendedProgessbar";
import { useState } from "react";
import type { UserProfile } from "../../models/user";
import { formatDateTime, sort } from "../../util";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "../../zustand/zustand";

export interface ExamScheduleProps extends Schedule {
	maxwidth?: StyleProp<string | number>;
	teacher?: boolean;
}

export function ExamSchedule(props: ExamScheduleProps) {
	const userId = useUserProfile((s) => s.instance)?.id;

	const selectedSlotId = props.examSlots
		.sort(sort((s) => s.date))
		.find(
			(s) =>
				s.actuallyParticipated.find((a) => a.id == userId) ||
				s.participants.find((p) => p.id == userId),
		)?.id;

	const [checked, setChecked] = useState<ExamSlotId>(selectedSlotId ?? "");
	function handleCheck(newId: ExamSlotId) {
		setChecked(newId);
	}

	return (
		<Paper maw={props.maxwidth} withBorder p="md" radius="md">
			<Flex align="flex-end">
				<Title order={2}>{props.subjectName}</Title>
				<Space w="md" />
				<Text>{props.description}</Text>
			</Flex>
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
		<div>
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
			<Flex justify="space-between" direction="row-reverse">
				<ScheduleRadio
					enabled={!scheduleProps.teacher}
					schedule={scheduleProps}
					scheduleSlot={props}
					setChecked={setChecked}
					checkedId={checkedId}
				/>
				<Group gap="xs">
					{...props.participants.map((p) =>
						ScheduleParticipant(p, !scheduleProps.teacher),
					)}
				</Group>
			</Flex>
		</div>
	);
}

function ScheduleParticipant(user: UserProfile, enableSwap: boolean) {
	function handleClick() {
		if (!enableSwap) return;
	}
	return <Kbd onClick={handleClick}>{user.name}</Kbd>;
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
