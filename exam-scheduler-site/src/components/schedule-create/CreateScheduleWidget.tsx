import { useCalendar } from "../../zustand/zustand";

export interface CreateScheduleWidgetProps {}

export function CreateScheduleWidget(props: CreateScheduleWidgetProps) {
	const calendar = useCalendar((s) => s.data);
    
}
