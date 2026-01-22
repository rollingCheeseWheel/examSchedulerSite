import type { BrandedId } from "./brand";

export type CalendarId = BrandedId<"calendar">;
export type LessonId = BrandedId<"lesson">;

export interface Calendar {
	id: CalendarId;
	lastsUntil: Date;
	lessons: Lesson[];
}

export interface Lesson {
	id: LessonId;
	occurances: Date[];
	fromHour: number;
	toHour: number;
	lessonName: string;
	teachers: Teacher[];
	subjectName: string;
}

export interface Teacher {
	firstName: string;
	lastName: string;
}

export interface Subject {
	name: string;
}
