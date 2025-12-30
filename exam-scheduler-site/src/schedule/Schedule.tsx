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
	Container,
} from "@mantine/core";
import type { Schedule, ScheduleSlot } from "../models/schedule";
import { ScheduleProgress } from "../common/ExtendedProgessbar";
import { useState, useTransition } from "react";
import type { UserProfile } from "../models/user";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../util";
import { useTranslation } from "react-i18next";

export interface ExamScheduleProps extends Schedule {
	maxwidth?: StyleProp<string | number>;
	teacher?: boolean;
}

export function ExamSchedule(props: ExamScheduleProps) {
	const [checked, setChecked] = useState<string>(props.selectedSlotId);

	function handleCheck(newId: string) {
		setChecked(newId);
	}

	return (
		<Paper maw={props.maxwidth} withBorder p="md" radius="md">
			<Flex align="flex-end">
				<Title order={2}>{props.subject.name}</Title>
				<Space w="md" />
				<Text>{props.description}</Text>
			</Flex>
			<Stack align="stretch" justify="flex-start" gap="xs">
				{...props.examSlots.map((s) =>
					ScheduleDate(s, props, handleCheck, checked)
				)}
			</Stack>
		</Paper>
	);
}

function ScheduleDate(
	props: ScheduleSlot,
	scheduleProps: ExamScheduleProps,
	setChecked: (checkedId: string) => void,
	checkedId: string
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
						ScheduleParticipant(p, !scheduleProps.teacher)
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

	let name = "";
	if (user.firstName && user.lastName) {
		name = user.firstName + " " + user.lastName;
	} else {
		name = user.lastName ?? user.firstName ?? user.id;
	}

	return <Kbd onClick={handleClick}>{name}</Kbd>;
}

interface ScheduleRadioProps {
	scheduleSlot: ScheduleSlot;
	schedule: Schedule;
	setChecked: (id: string) => void;
	checkedId: string;
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
