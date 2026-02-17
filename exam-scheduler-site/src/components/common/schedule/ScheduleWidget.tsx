import { Grid, type StyleProp } from "@mantine/core";
import type { ExamSlot, Schedule } from "../../../models/schedule";
import { useSchedules, useUserProfile } from "../../../zustand/zustand";
import { ExamSchedule } from "./Schedule";

interface ScheduleWidgetProps {
	maxwidth?: StyleProp<string | number>;
}

export function ScheduleWidget(props: ScheduleWidgetProps) {
	const userProfile = useUserProfile((s) => s.data);
	const schedules = useSchedules((s) => s.data);

	return (
		<Grid grow gutter={0}>
			{...schedules.map((schedule) => (
				<ExamSchedule
					schedule={schedule}
					selectedSlotId={
						schedule.examSlots.find((slot) =>
							slot.participants.find(
								(p) => p.id === userProfile?.id,
							),
						)?.id
					}
					maxwidth={props.maxwidth}
				/>
			))}
		</Grid>
	);
}
