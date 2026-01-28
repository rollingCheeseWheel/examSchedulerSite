import type { BrandedId } from "./brand";
import type { Calendar } from "./calendar";

export type ClassroomId = BrandedId<"classroom">;

export interface Classroom {
	id: ClassroomId;
	name: string;
	studentCount: number;
	calendar: Calendar;
}
