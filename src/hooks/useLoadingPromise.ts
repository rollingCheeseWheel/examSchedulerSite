import { useCallback, useEffect, useRef, useState } from "react";
import { singleOrList, type Action, type SingleOrList } from "../util";

export function useLoadingPromise(globalCallbacks?: {
	onLoading?: SingleOrList<Action<[boolean]>>;
	onSuccess?: SingleOrList<Action<[]>>;
	onError?: SingleOrList<Action<[any]>>;
}) {
	const [loading, setLoading] = useState(false);
	const lastCallId = useRef(0);

	const resolve = useCallback(
		<T>(
			promise?: Promise<T>,
			callbacks?: {
				onLoading?: SingleOrList<Action<[boolean]>>;
				onSuccess?: SingleOrList<Action<[T]>>;
				onError?: SingleOrList<Action<[any]>>;
			},
		) => {
			if (!promise) {
				return;
			}
			const callId = ++lastCallId.current;
			setLoading(true);

			for (const callback of singleOrList(
				callbacks?.onLoading,
				globalCallbacks?.onLoading,
			)) {
				callback(true);
			}

			promise
				.then((res) => {
					if (callId == lastCallId.current) {
						for (const callback of singleOrList(globalCallbacks?.onSuccess)) {
							callback();
						}
					}
					for (const callback of singleOrList(callbacks?.onSuccess)) {
						callback(res);
					}
				})
				.catch((reason) => {
					if (callId == lastCallId.current) {
						for (const callback of singleOrList(globalCallbacks?.onError)) {
							callback(reason);
						}
					}

					for (const callback of singleOrList(callbacks?.onError)) {
						callback(reason);
					}
				})
				.finally(() => {
					if (callId == lastCallId.current) {
						setLoading(false);
						for (const callback of singleOrList(globalCallbacks?.onLoading)) {
							callback(false);
						}
					}
					for (const callback of singleOrList(callbacks?.onLoading)) {
						callback(false);
					}
				});
		},
		[
			globalCallbacks?.onError,
			globalCallbacks?.onLoading,
			globalCallbacks?.onSuccess,
		],
	);

	const abort = useCallback(() => {
		lastCallId.current++;
	}, []);

	useEffect(
		() => () => {
			abort();
			setLoading(false);
			for (const callback of singleOrList(globalCallbacks?.onLoading)) {
				callback(false);
			}
		},
		[abort, globalCallbacks?.onLoading],
	);

	return { loading, resolve, abort };
}
