import type { MantineColor } from "@mantine/core";
import type { Calendar, Lesson, SubjectName } from "./models/calendar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func<Args extends any[], TResult> = (...args: Args) => TResult;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<Args extends any[]> = (...args: Args) => void;

export const dateTimeFormats: Record<"schedule", Intl.DateTimeFormatOptions> = {
	schedule: {
		weekday: "long",
		day: "numeric",
		month: "short",
	},
} as const;

export function formatDateTime(
	date: Date,
	locale: Intl.LocalesArgument,
	format: Intl.DateTimeFormatOptions = dateTimeFormats.schedule,
) {
	return new Intl.DateTimeFormat(locale, format).format(date);
}

export function groupBy<T, TKey extends string | number | symbol>(
	data: T[],
	selector: (item: T) => TKey,
): Record<TKey, T[]> {
	const map: Record<TKey, T[]> = {} as Record<TKey, T[]>;
	for (const item of data) {
		const key = selector(item);
		const existing = map[key];
		if (existing) {
			existing.push(item);
			map[key] = existing;
		} else {
			map[key] = [item];
		}
	}
	return map;
}

export function mapMap<T, TKey extends string | symbol | number, TResult>(
	data: Record<TKey, T[]>,
	selector: Func<[TKey, T[], Record<TKey, T[]>], TResult>,
): TResult[] {
	const result: TResult[] = [];
	for (const key in data) {
		result.push(selector(key, data[key], data));
	}
	return result;
}

export function sort<T, TKey>(
	selector: (instance: T) => TKey,
): (a: T, b: T) => number {
	return (a, b) => {
		const aKey = selector(a);
		const bKey = selector(b);
		if (!aKey && !bKey) return 0;
		if (!aKey) return -1;
		if (!bKey) return 1;

		if (typeof aKey === "number" && typeof bKey === "number") {
			return aKey - bKey;
		}
		return String(aKey).localeCompare(String(bKey));
	};
}

export type LessonColors = Record<SubjectName, MantineColor>;

export const lessonColors: MantineColor[] = [
	"gray",
	"red",
	"pink",
	"grape",
	"violet",
	"indigo",
	"cyan",
	"teal",
	"green",
	"lime",
	"yellow",
	"orange",
	"gray.4",
	"red.4",
	"pink.4",
	"grape.4",
	"violet.4",
	"indigo.4",
	"cyan.4",
	"teal.4",
	"green.4",
	"lime.4",
	"yellow.4",
	"orange.4",
];

export function getColorsForLessons(calendar: Calendar | Lesson[]) {
	const lessons = Array.isArray(calendar) ? calendar : calendar.lessons;
	const res: LessonColors = {};
	const subjectNames = Array.from(
		new Set(lessons.map((l) => l.subject.name)),
	).sort();

	for (let i = 0; i < subjectNames.length; i++) {
		res[subjectNames[i]] = lessonColors[i % lessonColors.length];
	}

	return res;
}
