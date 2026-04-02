import { useCallback, useEffect, useState } from "react";
import type { Action } from "../util";

const ttl = 1000 * 60 * 60 * 24 * 275; // 275 days

interface LocalStorageEntry<T> {
	value?: T;
	expires: number;
}

export function useLocalStorage<T>(
	key: string,
	defaultValue?: T,
	timeToLive: number = ttl,
): [T | undefined, Action<[T]>] {
	const get = useCallback(() => {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) {
				return undefined;
			}
			const parsed = JSON.parse(raw) as LocalStorageEntry<T>;
			if (Date.now() > parsed.expires) {
				localStorage.removeItem(key);
				return undefined;
			}
			return parsed.value;
		} catch {
			localStorage.removeItem(key);
			return undefined;
		}
	}, [key]);

	const setLocalStorage = useCallback(
		(value?: T) => {
			const data: LocalStorageEntry<T> = {
				value,
				expires: Date.now() + timeToLive,
			};
			localStorage.setItem(key, JSON.stringify(data));
		},
		[key, timeToLive],
	);

	const [value, setValue] = useState<T | undefined>(
		() => get() ?? setLocalStorage(defaultValue) ?? defaultValue,
	);

	const set = useCallback(
		(value: T) => {
			setLocalStorage(value);
			setValue(value);
		},
		[setLocalStorage],
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
