import { Grid, type StyleProp } from "@mantine/core";
import { useSchedules, useUserProfile } from "../../zustand/zustand";
import { useSignalRInit as useScheduleHubInit } from "../../hooks/userSignalR";
import { useIsFirstRender } from "@mantine/hooks";
import { UserRole } from "../../models/enums";
import { ExamSchedule } from "./Schedule";

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
				setSchedules(schedules);
			},
			UpdateSchedule(scheduleId, schedule) {
				setSchedules([
					...schedules.filter((s) => s.id !== scheduleId),
					schedule,
				]);
			},
		});
	}

	return (
		<Grid grow>
			{...schedules.map((schedule) => (
				<ExamSchedule
					{...{
						...schedule,
						teacher: userProfile?.role === UserRole.Teacher,
						maxwidth: props.maxwidth,
						selectedSlotId: schedule.examSlots.find((slot) =>
							slot.participants.find(
								(p) => p.id === userProfile?.id,
							),
						)?.id,
					}}
				/>
			))}
		</Grid>
	);
}
