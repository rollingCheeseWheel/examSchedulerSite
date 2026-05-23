import { useCallback, useEffect, useState } from "react";
import type { Action } from "../util";

class LocalStorageEvent extends CustomEvent<{ key: string }> {}
const localStorageEventName = "local-storage";

declare global {
	interface WindowEventMap {
		"local-storage": LocalStorageEvent;
	}
}

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

	window.dispatchEvent(
		new LocalStorageEvent(localStorageEventName, { detail: { key } }),
	);
}

export function useLocalStorage<T>(
	key: string,
	defaultValue?: T,
	timeToLive: number = ttl,
): [T | null | undefined, Action<[T]>] {
	const [value, setValue] = useState<T | null | undefined>(() => {
		const existing = getLocalStorage<T>(key);
		if (existing !== undefined) {
			return existing;
		}

		if (defaultValue !== undefined) {
			setLocalStorage(key, defaultValue, timeToLive);
		}

		return defaultValue;
	});

	const set = useCallback(
		(value: T) => {
			setLocalStorage(key, value, timeToLive);
			setValue(value);
		},
		[key, timeToLive],
	);

	useEffect(() => {
		function sync() {
			setValue(getLocalStorage<T>(key));
		}

		function storageHandler(e: StorageEvent) {
			if (e.key == key) {
				sync();
			}
		}

		function localHandler(e: LocalStorageEvent) {
			if (e.detail.key == key) {
				sync();
			}
		}

		window.addEventListener("storage", storageHandler);
		window.addEventListener("local-storage", localHandler);

		return () => {
			window.removeEventListener("storage", storageHandler);
			window.removeEventListener("local-storage", localHandler);
		};
	}, [key]);

	return [value, set] as const;
}
