import type { Brand, BrandedId, BrandedString, DateOnlyString } from "./brand";

export type CalendarId = BrandedId<"calendar">;
export type LessonId = BrandedId<"lesson">;

export type SubjectName = BrandedString<"subjectname">;
export type TeacherName = BrandedString<"teachername">;
export type LessonName = BrandedString<"lessonname">;

export type FromHour = Brand<number, "fromhour">;
export type ToHour = Brand<number, "tohour">;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Lesson {
	id: LessonId;
	date: DateOnlyString;
	fromHour: FromHour;
	toHour: ToHour;
	lessonName: LessonName;
	teachers: TeacherOnly[];
	subject: Subject;
}

export interface TeacherOnly {
	name: TeacherName
}

export interface TeacherWithSubjects extends TeacherOnly {
	subjects: Subject[]
}

export interface Subject {
	name: SubjectName;
}
