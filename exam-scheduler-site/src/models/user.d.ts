import type { Subject, Teacher } from "./calendar";
import type { Classroom } from "./classroom";
import type { UserRole } from "./enums";

export interface UserProfile {
	id: string;
	schoolId: string;
	firstName: string;
	lastName: string;
	role: number | UserRole;
}

interface BaseProfile {
	userProfile: UserProfile;
}

export interface StudentProfile extends BaseProfile {
	classroom: Classroom;
}

export interface TeacherProfile extends BaseProfile {
	calendarTeacher: Teacher;
	subject: Subject;
	classrooms: Classroom[];
}
