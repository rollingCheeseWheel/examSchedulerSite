export function dateTimeReviver(_: string, value: unknown) {
	if (typeof value === "string") {
		const d = new Date(value);
		if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
			return d;
		}
	}
	return value;
}
