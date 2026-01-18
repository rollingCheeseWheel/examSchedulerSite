import type { BrandedId } from "./brand";
import type { Calendar } from "./calendar";

export type ClassroomId = BrandedId<"classroom">;

export interface TeacherProfileClassroom {
	id: ClassroomId;
	name: string;
	schoolId: string;
	calendarId?: string;
}

export interface Classroom extends TeacherProfileClassroom {
	calendar?: Calendar;
}
