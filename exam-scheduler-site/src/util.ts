import { ActionIcon, createTheme, type MantineColor } from "@mantine/core";
import type { AuditLog } from "./models/auditLog";
import type { Lesson, Subject, SubjectName, Week } from "./models/calendar";
import type { Classroom } from "./models/classroom";
import type { ExamSlot, Schedule } from "./models/schedule";
import type { SwapRequest } from "./models/swapRequest";
import type { UserProfile } from "./models/user";
import { init } from "i18next";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IconAdjustmentsExclamation } from "@tabler/icons-react";

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

export function groupBy<TKey, TValue>(
	data: TValue[],
	selector: (item: TValue) => TKey,
): Map<TKey, TValue[]> {
	const result = new Map<TKey, TValue[]>();
	for (const item of data) {
		const key = selector(item);
		const existing = result.get(key);
		if (existing) {
			existing.push(item);
			result.set(key, existing);
		} else {
			result.set(key, [item]);
		}
	}
	return result;
}

export function mapKVPs<TKey, TValue, TResult>(
	data: Map<TKey, TValue>,
	selector: Func<[TValue, TKey, Map<TKey, TValue>], TResult>,
): Map<TKey, TResult> {
	const result = new Map<TKey, TResult>();
	for (const key of data.keys()) {
		result.set(key, selector(data.get(key)!, key, data));
	}
	return result;
}

export function reduceMap<TKey, TValue, TReturn>(
	data: Map<TKey, TValue[]>,
	reducer: Func<[TReturn, TValue, number, TValue[]], TReturn>,
	initialValue: TReturn,
): Map<TKey, TReturn> {
	const result = new Map<TKey, TReturn>();
	for (const key of data.keys()) {
		result.set(key, data.get(key)!.reduce(reducer, initialValue));
	}
	return result;
}

export function sort<
	T,
	TKey extends string | number | null | undefined =
		| string
		| number
		| null
		| undefined,
>(selector: Func<[T], TKey>): Func<[T, T], number> {
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

export function compoundSort<T>(
	...comparers: Func<[T, T], number>[]
): Func<[T, T], number> {
	return (a, b) => {
		for (const comparer of comparers) {
			const res = comparer(a, b);
			if (res !== 0) {
				return res;
			}
		}
		return 0;
	};
}

export const userProfileSorter = compoundSort<UserProfile>(
	sort((x) => x.name),
	sort((x) => x.role),
	sort((x) => x.id),
);

export const scheduleSorter = compoundSort<Schedule>(
	sort((x) => x.startDate.getTime()),
	sort((x) => x.endDate.getTime()),
	sort((x) => x.subject.name),
	sort((x) => x.id),
);

export const examSlotSorter = compoundSort<ExamSlot>(
	sort((x) => x.date.getTime()),
	sort((x) => x.participants.length),
	sort((x) => x.minParticipants),
	sort((x) => x.maxParticipants),
	sort((x) => x.id),
);

export const swapRequestSorter = compoundSort<SwapRequest>(
	sort((x) => x.requestingStudentName),
	sort((x) => x.id),
);

export const auditLogSorter = compoundSort<AuditLog>(
	sort((x) => x.timestamp.getTime()),
	sort((x) => x.originName),
	sort((x) => x.targetName),
);

export const classroomSorter = compoundSort<Classroom>(
	sort((x) => x.name),
	sort((x) => x.studentCount),
	sort((x) => x.id),
);

export const lessonSorter = compoundSort<Lesson>(
	sort((x) => x.dayOfWeek),
	sort((x) => x.fromHour),
	sort((x) => x.toHour),
	sort((x) => x.subject.name),
	sort((x) => x.id),
);

export const weekSorter = compoundSort<Week>(
	sort((x) => x.date.getTime())
)

export const subjectSorter = sort<Subject>((x) => x.name);

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

export function getColorsForLessons(lessons: Lesson[]) {
	const res: Record<SubjectName, MantineColor> = {};
	const subjectNames = Array.from(
		new Set(lessons.map((l) => l.subject.name)),
	).sort();

	for (let i = 0; i < subjectNames.length; i++) {
		res[subjectNames[i]] = lessonColors[i % lessonColors.length];
	}

	return res;
}

export const pointerCursorTheme = createTheme({
	cursorType: "pointer",
});

export function randomId(seed?: string) {
	return seed ? seed : Math.random().toString(36);
}

export function sleep<TReturn = unknown>(millis: number, value?: TReturn) {
	if (value === undefined) {
		return new Promise((resolve) =>
			setTimeout(resolve, millis),
		) as Promise<TReturn>;
	} else {
		return new Promise<TReturn>((resolve) =>
			setTimeout(() => resolve(value), millis),
		);
	}
}
