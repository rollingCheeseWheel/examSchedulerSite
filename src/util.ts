import { createTheme, type MantineColor } from "@mantine/core";
import type { TimeTableSlot } from "./components/teacher/schedule-create/TimeTable";
import type { AuditLog } from "./models/auditLog";
import type { Lesson, Subject, SubjectName } from "./models/calendar";
import type { Classroom } from "./models/classroom";
import type { ExamSlot, Schedule } from "./models/schedule";
import type { SwapRequest } from "./models/swapRequest";
import type { UserProfile } from "./models/user";
import type { SimpleResult } from "./models/result";

export type Primitive =
	| string
	| number
	| bigint
	| boolean
	| symbol
	| undefined
	| null;

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

export function floorDateToMonday(date: string | number | Date) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = (day + 6) % 7;
	d.setDate(d.getDate() - diff);
	return d;
}

export function addDaysToDate(date: string | Date, days: number) {
	const d = new Date(date);
	return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
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

function sort<
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

function compoundSort<T>(
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
	sort((x) => new Date(x.startDate).getTime()),
	sort((x) => new Date(x.endDate).getTime()),
	sort((x) => x.subject.name),
	sort((x) => x.id),
);

export const examSlotSorter = compoundSort<ExamSlot>(
	sort((x) => new Date(x.date).getTime()),
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
	sort((x) => new Date(x.timestamp).getTime()),
	sort((x) => x.originName),
	sort((x) => x.targetName),
);

export const classroomSorter = compoundSort<Classroom>(
	sort((x) => x.name),
	sort((x) => x.id),
);

export const lessonSorter = compoundSort<Lesson>(
	sort((x) => x.date),
	sort((x) => x.fromHour),
	sort((x) => x.toHour),
	sort((x) => x.subject.name),
	sort((x) => x.id),
);

export const timeTableSlotSorter = compoundSort<TimeTableSlot>(
	sort((x) => x.dayOfWeek),
	sort((x) => x.start),
	sort((x) => x.duration),
	sort((x) => x.label),
);

export const subjectSorter = sort<Subject>((x) => x.name);

export function equals<T, TKey extends Primitive>(
	selector: Func<[T], TKey>,
	value: TKey,
): Func<[T], boolean> {
	return (x) => selector(x) == value;
}

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

export function generateCollection<T>(
	count: number,
	instantiator: Func<[number], T>,
) {
	const res = [];
	for (let i = 0; i < count; i++) {
		res.push(instantiator(i));
	}
	return res;
}

export function randomFromRange<T = number>(end: number) {
	return Math.round(Math.random() * end) as T;
}

export function chooseRandom<T>(data: T[]) {
	const index = Math.round(Math.random() * data.length);
	return data[index];
}

export const jsonReviver = reviverCombiner(/* dateReviver */);

function reviverCombiner(
	...revivers: ((key: string, value: unknown) => unknown)[]
) {
	function combinedReviver(key: string, value: unknown) {
		for (const reviver of revivers) {
			try {
				return reviver(key, value);
			} catch {
				continue;
			}
		}
		return value;
	}

	return combinedReviver;
}

function dateReviver(_: string, value: unknown) {
	if (typeof value === "string") {
		const d = new Date(value);
		if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
			return d;
		}
	}
	throw new Error();
}

export type SingleOrList<T> = T | T[];

export function singleOrList<T>(
	...singleOrLists: (SingleOrList<T> | undefined)[]
): T[] {
	const res: T[] = [];
	for (const singleOrList of singleOrLists) {
		if (singleOrList) {
			res.push(
				...(Array.isArray(singleOrList) ? singleOrList : [singleOrList]),
			);
		}
	}
	return res;
}

export function ensureSuccessCode(promise: Promise<SimpleResult>) {
	return promise.then((r) => {
		if (!r.success || r.errors) {
			throw new Error(r.errors?.join(", "));
		} else
		{
			return r;
		}
	});
}
