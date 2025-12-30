import {
	Group,
	Progress,
	Text,
	Tooltip,
	type ProgressRootProps,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

interface ExtendedProgressbarProps extends ProgressRootProps {
	participants: number;
	max: number;
	min: number;
}

export function ExtendedProgressbar(props: ExtendedProgressbarProps) {
	const { participants, max, min } = props;
	const [participantsValue, minValue] = [
		(participants * 100) / Math.max(1, max),
		(min * 100) / Math.max(1, max),
	];

	return (
		<Progress.Root autoContrast {...props} orientation="horizontal">
			<Progress.Section
				value={participantsValue}
				color={
					participants > min
						? participants >= max
							? "green.6"
							: "yellow.6"
						: "red.6"
				}>
				<Progress.Label>{participants}</Progress.Label>
			</Progress.Section>
			{participants < min && (
				<Progress.Section
					value={minValue - participantsValue}
					color="gray.6">
					<Progress.Label>{min - participants}</Progress.Label>
				</Progress.Section>
			)}
		</Progress.Root>
	);
}

export function ScheduleProgress(props: ExtendedProgressbarProps) {
	const { participants: curr, max: max, min: min } = props;
	console.log(curr, max, min);

	const { t } = useTranslation();
	return (
		<Tooltip
			label={t("schedule.progess.tooltip", {
				min: min,
				max: max,
				curr: curr,
			})}>
			{" "}
			{/* {{curr}} out of {{max}} - {{min}} needed */}
			<Group justify="flex-end">
				<Group gap="xs">
					<Text>{min}</Text>
					<Text>|</Text>
					<Text
						fw={700}
						c={
							curr > min
								? curr >= max
									? "green"
									: "yellow"
								: "red"
						}>
						{curr}
					</Text>
					<Text fw={700}>/</Text>
					<Text fw={700}>{max}</Text>
				</Group>
				<ExtendedProgressbar style={{ flex: 1 }} {...props} />
			</Group>
		</Tooltip>
	);
}
