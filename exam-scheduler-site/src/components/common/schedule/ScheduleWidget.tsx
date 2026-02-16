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
			{...schedules.map((schedule) => {
				const mappedSlots = schedule.examSlots
					.sort((a, b) => a.date.getTime() - b.date.getTime())
					.map<ExamSlot>((s) => {
						const sorted = s.participants
							.sort((a, b) => a.name.length - b.name.length)
							.reverse();

						return { ...s, participants: sorted };
					});

				const tempSchedule: Schedule = {
					...schedule,
					examSlots: mappedSlots,
				};

				return (
					<ExamSchedule
						schedule={tempSchedule}
						selectedSlotId={
							schedule.examSlots.find((slot) =>
								slot.participants.find(
									(p) => p.id === userProfile?.id,
								),
							)?.id
						}
						maxwidth={props.maxwidth}
					/>
				);
			})}
		</Grid>
	);
}
