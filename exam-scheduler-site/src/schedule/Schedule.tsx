import { Paper, Title } from "@mantine/core";

export interface ScheduleProps {
	subject: string;
	dates: ScheduleDate[];
}

export default function Schedule(props: ScheduleProps) {
	return (
		<Paper>
			<Title>{props.subject}</Title>
		</Paper>
	);
}
