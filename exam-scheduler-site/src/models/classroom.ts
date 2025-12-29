import type { Calendar } from "./calendar";

export interface TeacherProfileClassroom {
	id: string;
	name: string;
	schoolId: string;
	calendarId?: string;
}

export interface Classroom extends TeacherProfileClassroom {
	calendar?: Calendar;
}
