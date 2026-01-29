import { Grid, type StyleProp } from "@mantine/core";
import { useSchedules, useUserProfile } from "../../zustand/zustand";
import { useSignalRInit as useScheduleHubInit } from "../../hooks/useSignalR";
import { useIsFirstRender } from "@mantine/hooks";
import { ExamSchedule } from "./Schedule";
import type { ExamSlot, Schedule } from "../../models/schedule";

interface ScheduleWidgetProps {
	maxwidth?: StyleProp<string | number>;
}

export function ScheduleWidget(props: ScheduleWidgetProps) {
	const { instance: userProfile, hasChanged: hasAuthenticated } =
		useUserProfile();
	const { data: schedules, setData: setSchedules } = useSchedules();
	const { init } = useScheduleHubInit();

	if (useIsFirstRender() && hasAuthenticated) {
		init({
			ReceiveInitial(schedules) {
				console.log(schedules);

				setSchedules(schedules);
			},
			UpdateSchedule(scheduleId, schedule) {
				console.log(schedule);

				setSchedules([
					...schedules.filter((s) => s.id !== scheduleId),
					schedule,
				]);
			},
		});
	}

	return (
		<Grid grow gutter={0}>
			{...schedules.map((schedule) => {
				const mappedSlots = schedule.examSlots
					.sort((a, b) => a.date.getTime() - b.date.getTime())
					.map<ExamSlot>((s) => {
						const sorted = s.participants.sort(
							(a, b) => a.name.length - b.name.length,
						)
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
