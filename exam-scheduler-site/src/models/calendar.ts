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
	subject: Subject;
}

export interface Teacher {
	name: string;
}

export interface Subject {
	name: string;
}
