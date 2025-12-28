import {
	Group,
	Progress,
	Text,
	Tooltip,
	Flex,
	type ProgressRootProps,
	type ProgressSectionProps,
} from "@mantine/core";

interface ExtendedProgressbarProps extends ProgressRootProps {
	participants: number;
	max: number;
	min: number;
}

export function ExtendedProgressbar(props: ExtendedProgressbarProps) {
	const { participants, max, min } = props;
	const [participantsValue, minValue] = [
		Math.round((participants * 100) / max),
		Math.round((min * 100) / max),
	];

	return (
		<Progress.Root autoContrast {...props} transitionDuration={100}>
			<Progress.Section
				value={participantsValue}
				color={
							participants > min
								? participants >= max
									? "green.6"
									: "yellow.6"
								: "red.6"
						}
			>
				<Progress.Label>{participants}</Progress.Label>
			</Progress.Section>
			<Progress.Section
				value={minValue - participantsValue}
				color="gray.6"
			>
				{participants < min && (
					<Progress.Label>{min - participants}</Progress.Label>
				)}
			</Progress.Section>
		</Progress.Root>
	);
}

export function ScheduleProgress(props: ExtendedProgressbarProps) {
	const { participants, max: maxParticipants, min: minParticipants } = props;
	return (
		<Tooltip
			label={`${participants} out of ${maxParticipants} - needs at least ${minParticipants} `}
		>
			<Group justify="flex-end">
				<Group gap="xs">
					<Text>{minParticipants}</Text>
					<Text>|</Text>
					<Text
						c={
							participants > minParticipants
								? participants >= maxParticipants
									? "green"
									: "yellow"
								: "red"
						}
					>
						{participants}
					</Text>
					<Text>/</Text>
					<Text c="blue">{maxParticipants}</Text>
				</Group>
				<ExtendedProgressbar style={{ flex: 1 }} {...props} />
			</Group>
		</Tooltip>
	);
}
