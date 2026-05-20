import { useEffect, useState } from "react";
import { tokenExpirationInMillisecondsLocalStorageKey } from "../main";
import type { DateNumber } from "../models/brand";
import type { Action } from "../util";
import { useLocalStorage } from "./useLocalStorage";

export function useIsLoggedIn(): [boolean, Action<[DateNumber]>] {
	const [expiration, setSessionExpiration] = useLocalStorage<DateNumber>(
		tokenExpirationInMillisecondsLocalStorageKey,
	);

	const [isLoggedIn, setIsLoggedIn] = useState((expiration ?? 0) > Date.now());

	useEffect(() => {
		const loggedIn = (expiration ?? 0) > Date.now();

		setIsLoggedIn(loggedIn);

		if (!loggedIn) return;

		const timeout = setTimeout(() => {
			setIsLoggedIn(false);
		}, expiration! - Date.now());

		return () => clearTimeout(timeout);
	}, [expiration]);

	return [isLoggedIn, setSessionExpiration];
}
