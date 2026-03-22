import { Progress, Tooltip, type ProgressRootProps } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface ExtendedProgressbarProps extends ProgressRootProps {
	participants: number;
	max: number;
	min?: number;
}

export function ExtendedProgressbar(props: ExtendedProgressbarProps) {
	const { participants, max, min } = props;
	const participantsValue = Math.round((participants * 100) / Math.max(1, max));
	const minValue = Math.round((min ?? 0 * 100) / Math.max(1, max));

	return (
		<Progress.Root autoContrast {...props}>
			<Progress.Section
				value={participantsValue}
				color={
					participants > (min ?? 0) ?
						participants >= max ?
							"gray.6"
						:	"green.6"
					:	"yellow.6"
				}>
				<Progress.Label>
					{participants} / {max}
				</Progress.Label>
			</Progress.Section>
			{/* {participants < min && (
				<Progress.Section
					value={minValue - participantsValue}
					color="gray.6"
				>
					<Progress.Label>{min - participants}</Progress.Label>
				</Progress.Section>
			)} */}
		</Progress.Root>
	);
}

export function ScheduleProgress(props: ExtendedProgressbarProps) {
	const { participants: curr, max: max, min: min } = props;
	const { t } = useTranslation();

	return (
		<Tooltip
			label={t("schedule.progess.tooltip", {
				// {{curr}} out of {{max}} - {{min}} needed
				min: min,
				max: max,
				curr: curr,
			})}>
			<ExtendedProgressbar style={{ flex: 1 }} {...props} />
		</Tooltip>
	);
}
