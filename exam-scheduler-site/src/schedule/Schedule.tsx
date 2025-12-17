import {
	Group,
	Flex,
	Paper,
	Title,
	Space,
	Text,
	Radio,
	Container,
	Stack,
	type StyleProp,
	CheckIcon,
	Kbd,
	Grid,
} from "@mantine/core";
import type { Schedule, ScheduleSlot } from "../models/schedule";
import ScheduleProgress from "../common/ExtendedProgessbar";
import { useState } from "react";
import type { UserProfile } from "../models/user";
import { useNavigate } from "react-router-dom";

export interface ExamScheduleProps extends Schedule {
	width?: StyleProp<string | number>;
}

export function ExamSchedule(props: ExamScheduleProps) {
	const [checked, setChecked] = useState<string>();

	console.log(checked);

	return (
		<Paper>
			<Container w={props.width}>
				<Flex align="flex-end">
					<Title order={2}>{props.subject.name}</Title>
					<Space w="md" />
					<Text>{props.description}</Text>
				</Flex>
				<Stack align="stretch" justify="flex-start">
					{...props.examSlots.map((s, i) =>
						ScheduleDate(s, props, i, setChecked)
					)}
				</Stack>
			</Container>
		</Paper>
	);
}

function ScheduleDate(
	props: ScheduleSlot,
	schedule: Schedule,
	index: number,
	setChecked: (checkedId: string) => void
) {
	return (
		<div>
			<Grid>
				<Grid.Col span="content">
					<Text>{props.date}</Text>
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
			<Group justify="space-between">
				<Group gap="xs">
					{...props.participants.map(ScheduleParticipant)}
				</Group>
				<Radio
					icon={CheckIcon}
					name={schedule.id}
					onChange={() => setChecked(props.id)}
				/>
			</Group>
		</div>
	);
}

function ScheduleParticipant(user: UserProfile) {
	const navigate = useNavigate();

	function handleClick() {}

	let name = "";
	if (user.firstName && user.lastName) {
		name = user.firstName + " " + user.lastName;
	} else {
		name = user.lastName ?? user.firstName ?? user.id;
	}

	return <Kbd onClick={handleClick}>{name}</Kbd>;
}
