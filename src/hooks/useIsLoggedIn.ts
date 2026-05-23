import { useEffect, useState } from "react";
import { tokenExpirationInMillisecondsLocalStorageKey } from "../main";
import type { DateNumber } from "../models/brand";
import type { Action } from "../util";
import { useLocalStorage } from "./useLocalStorage";

export function useIsLoggedIn(): [boolean, Action<[DateNumber]>] {
	const [expiration, setSessionExpiration] = useLocalStorage<DateNumber>(
		tokenExpirationInMillisecondsLocalStorageKey,
	);

	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		if (!((expiration ?? 0) > now)) return;

		const remaining = (expiration ?? 0) - now;
		if (remaining <= 0) {
			setNow(Date.now());
			return;
		}

		const timeout = setTimeout(() => setNow(Date.now()), remaining);

		return () => clearTimeout(timeout);
	}, [expiration, now]);

	return [(expiration ?? 0) > now, setSessionExpiration];
}
