import type { BrandedId, BrandedString } from "./brand";
import type { TeacherWithSubjects } from "./calendar";
import type { UserProfile } from "./user";

export type ClassroomId = BrandedId<"classroom">;
export type ClassroomName = BrandedString<"classroomname">;

export interface Classroom {
	id: ClassroomId;
	name: ClassroomName;
	teachers: TeacherWithSubjects[];
	students: UserProfile[];
}
