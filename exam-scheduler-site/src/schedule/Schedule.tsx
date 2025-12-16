import {
	Grid,
	Group,
	Flex,
	Paper,
	Stack,
	Title,
	Space,
	Text,
} from "@mantine/core";
import type { ScheduleSlot, Schedule } from "../models/schedule";

export function ExamSchedule(props: Schedule) {
	return (
		<Paper>
			<Flex align="flex-end">
				<Title order={2}>{props.subject.name}</Title>
				<Space w="md" />
				<Title order={4}>{props.description}</Title>
			</Flex>
			<Grid grow>{props.examSlots.map(ScheduleDate)}</Grid>
		</Paper>
	);
}

function ScheduleDate(props: ScheduleSlot) {
	return (
		<Grid.Col span={1}>
			<Stack>
				<Group justify="space-between">
					{/* date and participant count */}
					<Group>
						<Title>{props.date}</Title>
						<Title>{props.participants.length}/{props.}</Title>
					</Group>
					{/* timer and radio button */}
					<Group></Group>
				</Group>
				<Text>
					{props.participants
						.map((x) => x.userProfile.lastName)
						.join(", ")}
				</Text>
			</Stack>
		</Grid.Col>
	);
}
