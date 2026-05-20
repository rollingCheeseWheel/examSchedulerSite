/* 
	declare global {
		interface WindowEventMap {
			"local-storage": LocalStorageEvent;
		}
	}
*/

import { useEffect, useState } from "react";
import type { Action } from "../util";

export function useListenEvent<K extends keyof WindowEventMap>(
	eventName: K,
	listener?: Action<[WindowEventMap[K]]>,
) {
	const [increment, setIncrement] = useState(0);

	useEffect(() => {
		function handler() {
			setIncrement((prev) => prev + 1);
		}

		if (listener) {
			window.addEventListener(eventName, listener);
		}
		window.addEventListener(eventName, handler);

		return () => {
			if (listener) {
				window.removeEventListener(eventName, listener);
			}
			window.removeEventListener(eventName, handler);
		};
	}, [eventName, listener]);

	return increment;
}
