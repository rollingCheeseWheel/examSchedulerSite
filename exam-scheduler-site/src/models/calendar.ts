import type { Brand, BrandedId, BrandedString } from "./brand";

export type CalendarId = BrandedId<"calendar">;
export type LessonId = BrandedId<"lesson">;

export type SubjectName = BrandedString<"subjectname">;
export type TeacherName = BrandedString<"teachername">;
export type LessonName = BrandedString<"lessonname">;

export type FromHour = Brand<number, "fromhour">;
export type ToHour = Brand<number, "tohour">;
export type DateOnly = BrandedString<"dateonly">;

export interface Lesson {
	id: LessonId;
	date: DateOnly;
	fromHour: FromHour;
	toHour: ToHour;
	lessonName: LessonName;
	teachers: Teacher[];
	subject: Subject;
}

export interface Teacher {
	name: TeacherName;
}

export interface Subject {
	name: SubjectName;
}
