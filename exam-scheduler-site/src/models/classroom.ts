import type { BrandedId } from "./brand";
import type { Calendar, CalendarId } from "./calendar";
import type { SchoolId } from "./school";

export type ClassroomId = BrandedId<"classroom">;

export interface Classroom {
	id: ClassroomId;
	name: string;
	schoolId: SchoolId;
	calendarId?: CalendarId;
	calendar?: Calendar;
}
