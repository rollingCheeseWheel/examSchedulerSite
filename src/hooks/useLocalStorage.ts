import { useCallback, useEffect, useState } from "react";
import type { Action } from "../util";

const ttl = 1000 * 60 * 60 * 24 * 275; // 275 days

interface LocalStorageEntry<T> {
	value: T;
	creation: number;
}

export function useLocalStorage<T>(
	key: string,
	defaultValue?: T,
): [T | undefined, Action<[T]>] {
	const get = useCallback(() => {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) {
				return undefined;
			}
			const parsed = JSON.parse(raw) as LocalStorageEntry<T>;
			if (Date.now() > parsed.creation + ttl) {
				localStorage.removeItem(key);
				return undefined;
			}
			return parsed.value;
		} catch {
			localStorage.removeItem(key);
			return undefined;
		}
	}, [key]);

	const [value, setValue] = useState<T | undefined>(
		() => get() ?? defaultValue,
	);

	const set = useCallback(
		(value: T) => {
			const data: LocalStorageEntry<T> = {
				value,
				creation: Date.now(),
			};
			localStorage.setItem(key, JSON.stringify(data));
			setValue(value);
		},
		[key],
	);

	useEffect(() => {
		function handler(e: StorageEvent) {
			if (e.key == key) {
				setValue(get());
			}
		}
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, [get, key]);

	return [value, set] as const;
}
