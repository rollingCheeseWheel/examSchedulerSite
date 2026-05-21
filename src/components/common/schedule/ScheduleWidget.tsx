import { Center, Grid, Title, type StyleProp } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useSchedules, useUserProfile } from "../../../hooks/zustand";
import { ExamSchedule } from "./Schedule";

interface ScheduleWidgetProps {
	maxwidth?: StyleProp<string | number>;
}

export function ScheduleWidget(props: ScheduleWidgetProps) {
	const { t } = useTranslation();
	const userProfile = useUserProfile((s) => s.data);
	const schedules = useSchedules((s) => s.asArray);

	if (schedules.length == 0) {
		return (
			<Center>
				<Title>{t("schedule.empty")}</Title>
			</Center>
		);
	}

	return (
		<Grid grow gutter={0}>
			{...schedules.map((schedule) => (
				<ExamSchedule
					key={schedule.id}
					schedule={schedule}
					selectedSlotId={
						schedule.examSlots.find((slot) =>
							slot.participants.find((p) => p.id === userProfile?.id),
						)?.id
					}
					maxwidth={props.maxwidth}
				/>
			))}
		</Grid>
	);
}
