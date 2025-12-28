import type { Subject, Teacher } from "./calendar";
import type { Classroom } from "./classroom";
import type { UserRole } from "./enums";

export interface UserProfile {
	id: string;
	firstName?: string;
	lastName?: string;
	role: UserRole;
}

export interface TeacherProfile {
	userProfile: UserProfile;
	calendarTeacher: Teacher;
	subject: Subject;
	classrooms: Classroom[];
}
