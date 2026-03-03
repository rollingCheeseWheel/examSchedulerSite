import type { BrandedId, BrandedString } from "./brand";

export type ClassroomId = BrandedId<"classroom">;
export type ClassroomName = BrandedString<"classroomname">;

export interface Classroom {
	id: ClassroomId;
	name: ClassroomName;
	studentCount: number;
}
