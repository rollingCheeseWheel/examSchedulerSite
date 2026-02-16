import type { BrandedId, BrandedString } from "./brand";
import type { Calendar } from "./calendar";

export type ClassroomId = BrandedId<"classroom">;
export type ClassroomName = BrandedString<"classroomname">;

export interface Classroom {
	id: ClassroomId;
	name: ClassroomName;
	studentCount: number;
	calendar: Calendar;
}
