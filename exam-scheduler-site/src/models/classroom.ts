import type { BrandedId } from "./brand";
import type { Calendar, CalendarId } from "./calendar";
import type { SchoolId } from "./school";

export type ClassroomId = BrandedId<"classroom">;

export interface Classroom {
	id: ClassroomId;
	name: string;
	studentCount: number;
	schoolId: SchoolId;
	calendar?: Calendar;
	calendarId?: CalendarId;
}
