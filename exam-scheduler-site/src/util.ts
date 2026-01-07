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
	format: Intl.DateTimeFormatOptions = dateTimeFormats.schedule
) {
	return new Intl.DateTimeFormat(locale, format).format(date);
}

export function groupBy<T, TKey>(
	data: T[],
	selector: (item: T) => TKey
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
	selector: (key: TKey, items: T[], data: Map<TKey, T[]>) => TResult
): TResult[] {
	const result: TResult[] = [];
	for (const [k, v] of data.entries()) {
		result.push(selector(k, v, data));
	}
	return result;
}
