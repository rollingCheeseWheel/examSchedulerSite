import type { BrandedId } from "./brand";
import type { ClassroomId } from "./classroom";

export type CalendarId = BrandedId<"calendar">;
export type LessonId = BrandedId<"lesson">;

export interface Calendar {
	id: CalendarId;
	lastsUntil: Date;
	lessons: Lesson[];
	classroomId: ClassroomId;
}

export interface Lesson {
	id: LessonId;
	occurances: Date[];
	fromHour: number;
	toHour: number;
	lessonName: string;
	teachers: Teacher[];
	subject: Subject;
}

export interface Teacher {
	firstName: string;
	lastName: string;
}

export interface Subject {
	name: string;
}
