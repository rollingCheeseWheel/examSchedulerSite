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
