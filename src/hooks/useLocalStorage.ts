import { useCallback, useEffect, useState } from "react";
import type { Action } from "../util";

const ttl = 1000 * 60 * 60 * 24 * 275; // 275 days

interface LocalStorageEntry<T> {
	value?: T;
	expires: number;
}

export function getLocalStorage<T>(key: string): T | null | undefined {
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
}

export function setLocalStorage<T>(
	key: string,
	value: T,
	timeToLive: number = ttl,
) {
	const data: LocalStorageEntry<T> = {
		value,
		expires: Date.now() + timeToLive,
	};
	localStorage.setItem(key, JSON.stringify(data));
}

export function useLocalStorage<T>(
	key: string,
	defaultValue?: T,
	timeToLive: number = ttl,
): [T | null | undefined, Action<[T]>] {
	const [value, setValue] = useState<T | null | undefined>(
		() =>
			getLocalStorage<T>(key) ??
			setLocalStorage(key, defaultValue, timeToLive) ??
			defaultValue,
	);

	const set = useCallback(
		(value: T) => {
			setLocalStorage(key, defaultValue, ttl);
			setValue(value);
		},
		[defaultValue, key],
	);

	useEffect(() => {
		function handler(e: StorageEvent) {
			if (e.key == key) {
				setValue(getLocalStorage<T>(key));
			}
		}
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, [key]);

	return [value, set] as const;
}
