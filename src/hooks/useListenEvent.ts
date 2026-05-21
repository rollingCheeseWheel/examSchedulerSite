/* 
	declare global {
		interface WindowEventMap {
			"local-storage": LocalStorageEvent;
		}
	}
*/

import { useCallback, useEffect, useState } from "react";
import type { Action } from "../util";

export function useListenEvent<K extends keyof WindowEventMap>(
	eventName: K,
	listener?: Action<[WindowEventMap[K]]>,
) {
	const [_, setIncrement] = useState(0);

	const emit = useCallback(
		(event?: WindowEventMap[K]) => {
			if (!event) {
				window.dispatchEvent(new CustomEvent(eventName));
			} else {
				window.dispatchEvent(event);
			}
		},
		[eventName],
	);

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

	return emit;
}
