import { Paper, Title } from "@mantine/core";

export interface ScheduleProps {
	subject: string;
	
}

export interface ScheduleDate {
	date: string;
	lockinDate: string;
	guid: string;
	
}

export default function StudentSchedule(props: ScheduleProps) {
	return (
		<Paper>
			<Title>{props.subject}</Title>
		</Paper>
	);
}
