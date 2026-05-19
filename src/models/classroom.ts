import type { BrandedId, BrandedString } from "./brand";
import type { TeacherWithSubjects } from "./calendar";

export type ClassroomId = BrandedId<"classroom">;
export type ClassroomName = BrandedString<"classroomname">;

export interface Classroom {
	id: ClassroomId;
	name: ClassroomName;
	teachers: TeacherWithSubjects[];
}
