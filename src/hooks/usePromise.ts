import { useCallback, useEffect, useRef, useState } from "react";
import {
	singleOrList,
	type Action,
	type Func,
	type SingleOrList,
} from "../util";
import { useLoadingOverlay } from "./zustand";

export interface GlobalCallbacks {
	suppressDefaultLoad?: boolean;
	onLoading?: SingleOrList<Action<[boolean]>>;
	onSuccess?: SingleOrList<Action<[unknown]>>;
	onError?: SingleOrList<Action<[unknown]>>;

	onCleanup?: SingleOrList<Action<[]>>;
}

export interface LocalCallbacks<T> extends Omit<
	GlobalCallbacks,
	"onSuccess" | "onCleanup"
> {
	onSuccess?: SingleOrList<Action<[T]>>;

	ignoreGlobalLoading?: boolean;
	ignoreGlobalSuccess?: boolean;
	ignoreGobalError?: boolean;
}

export function usePromise(globalCallbacks?: GlobalCallbacks) {
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const [loading, setLoading] = useState(false);
	const lastCallId = useRef(0);
	const abortControllerRef = useRef(new AbortController());

	const resolve = useCallback(
		<T>(
			promise?: Promise<T> | Func<[AbortSignal], Promise<T> | undefined>,
			localCallbacks?: LocalCallbacks<T>,
		) => {
			if (typeof promise == "function") {
				promise = promise(abortControllerRef.current.signal);
			}

			if (!promise) {
				return;
			}
			const callId = ++lastCallId.current;
			setLoading(true);

			if (
				!(
					localCallbacks?.suppressDefaultLoad ||
					globalCallbacks?.suppressDefaultLoad
				)
			) {
				setLoadingOverlayState(true);
			}

			if (!localCallbacks?.ignoreGlobalLoading) {
				for (const callback of singleOrList(globalCallbacks?.onLoading)) {
					callback(true);
				}
			}

			for (const callback of singleOrList(localCallbacks?.onLoading)) {
				callback(true);
			}

			promise
				.then((res) => {
					if (
						callId == lastCallId.current &&
						!localCallbacks?.ignoreGlobalSuccess
					) {
						for (const callback of singleOrList(globalCallbacks?.onSuccess)) {
							callback(res);
						}
					}
					for (const callback of singleOrList(localCallbacks?.onSuccess)) {
						callback(res);
					}
				})
				.catch((reason) => {
					if (
						callId == lastCallId.current &&
						!localCallbacks?.ignoreGobalError
					) {
						for (const callback of singleOrList(globalCallbacks?.onError)) {
							callback(reason);
						}
					}

					for (const callback of singleOrList(localCallbacks?.onError)) {
						callback(reason);
					}
				})
				.finally(() => {
					if (callId == lastCallId.current) {
						setLoading(false);

						if (
							!(
								localCallbacks?.suppressDefaultLoad ||
								globalCallbacks?.suppressDefaultLoad
							)
						) {
							setLoadingOverlayState(false);
						}

						if (!localCallbacks?.ignoreGlobalLoading) {
							for (const callback of singleOrList(globalCallbacks?.onLoading)) {
								callback(false);
							}
						}
					}
					for (const callback of singleOrList(localCallbacks?.onLoading)) {
						callback(false);
					}
				});
		},
		[
			globalCallbacks?.suppressDefaultLoad,
			globalCallbacks?.onError,
			globalCallbacks?.onLoading,
			globalCallbacks?.onSuccess,
			setLoadingOverlayState,
		],
	);

	const abort = useCallback(() => {
		lastCallId.current++;
		abortControllerRef.current.abort();
	}, []);

	useEffect(
		() => () => {
			abort();
			setLoading(false);
			for (const callback of singleOrList(globalCallbacks?.onLoading)) {
				callback(false);
			}
			for (const callback of singleOrList(globalCallbacks?.onCleanup)) {
				callback();
			}
		},
		[abort, globalCallbacks?.onCleanup, globalCallbacks?.onLoading],
	);

	return {
		loading,
		resolve,
		abort,
		signal: abortControllerRef.current.signal,
	} as const;
}
