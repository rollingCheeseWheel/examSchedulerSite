import type { ReactNode } from "react";
import * as reactRouter from "react-router-dom";

export const dateTimeFormats: Record<"schedule", Intl.DateTimeFormatOptions> = {
	schedule: {
		weekday: "long",
		day: "numeric",
		month: "long",
	},
} as const;

export function formatDateTime(
	date: Date,
	locale: Intl.LocalesArgument,
	format: Intl.DateTimeFormatOptions = dateTimeFormats.schedule,
) {
	return new Intl.DateTimeFormat(locale, format).format(date);
}

export function groupBy<T, TKey>(
	data: T[],
	selector: (item: T) => TKey,
): Map<TKey, T[]> {
	const map = new Map<TKey, T[]>();
	for (const item of data) {
		const key = selector(item);
		const existing = map.get(key);
		if (existing) {
			existing.push(item);
		} else {
			map.set(key, [item]);
		}
	}
	return map;
}

export function mapMap<T, TKey, TResult>(
	data: Map<TKey, T[]>,
	selector: (key: TKey, items: T[], data: Map<TKey, T[]>) => TResult,
): TResult[] {
	const result: TResult[] = [];
	for (const [k, v] of data.entries()) {
		result.push(selector(k, v, data));
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

export class TimeSpan {
	private static readonly pattern =
		/^(-)?(?:(\d+)\.)?(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?$/;

	private _date: Date;

	constructor(milliseconds: number | Date) {
		this._date = new Date(milliseconds);
	}

	public static parse(value: string): TimeSpan {
		const match = this.pattern.exec(value);
		if (!match) {
			throw new Error("Invalid TimeSpan format");
		}

		const [, sign, days, hours, minutes, seconds, fraction] = match;

		const totalMilliseconds =
			((days ? parseInt(days, 10) : 0) * 86400000 +
				parseInt(hours, 10) * 3600000 +
				parseInt(minutes, 10) * 60000 +
				parseInt(seconds, 10) * 1000 +
				(fraction
					? parseInt(fraction.padEnd(7, "0"), 10) / 10_000
					: 0)) *
			(sign ? -1 : 1);

		return new TimeSpan(totalMilliseconds);
	}

	public getTime(): number {
		return this._date.getTime();
	}

	public getDate(): Date {
		return this._date;
	}
}
