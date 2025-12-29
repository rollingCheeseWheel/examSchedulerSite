import type { Subject, Teacher } from "./calendar";
import type { Classroom, TeacherProfileClassroom } from "./classroom";
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
	subjects: Subject[];
	classrooms: TeacherProfileClassroom[];
}
