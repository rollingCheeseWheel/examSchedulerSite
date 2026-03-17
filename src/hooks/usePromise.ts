import { useCallback, useEffect, useRef, useState } from "react";
import type { Action, Func } from "../util";

export function usePromise<TResult = never>(...callbacks: Action<[]>[]) {
	const [data, setData] = useState<TResult | undefined | null>();
	const [error, setError] = useState<unknown>();
	const [loading, setLoading] = useState(false);

	const callIdRef = useRef(0);
	const mountedRef = useRef(true);
	const abortControllersRef = useRef<AbortController[]>([]);

	useEffect(() => {
		return () => {
			// WARNING + TODO: uncomment when in prod, only prevents un and remount issues from strictmode
			// mountedRef.current = false;
			setLoading(false);
		};
	}, []);

	const abort = useCallback(() => {
		mountedRef.current = false;
		callIdRef.current++;
		setLoading(false);
		const localCopy = abortControllersRef.current;
		abortControllersRef.current = [];
		for (const abortController of localCopy) {
			abortController.abort();
		}
	}, []);

	const getSignal = useCallback(() => {
		const controller = new AbortController();
		abortControllersRef.current.push(controller);
		return controller.signal;
	}, []);

	const resolve = useCallback(
		(promise?: Promise<TResult> | Func<[AbortSignal], Promise<TResult>>) => {
			if (!promise) {
				return;
			}
			if (typeof promise === "function") {
				promise = promise(getSignal());
			}

			const callId = ++callIdRef.current;

			setData(undefined);
			setError(undefined);
			setLoading(true);

			promise
				.then((result) => {
					if (!mountedRef.current || callId !== callIdRef.current) return;
					setData(result);
					callbacks.forEach((x) => x);
				})
				.catch((err) => {
					if (!mountedRef.current || callId !== callIdRef.current) return;
					setError(err);
				})
				.finally(() => {
					if (!mountedRef.current || callId !== callIdRef.current) return;
					setLoading(false);
				});
		},
		[callbacks, getSignal],
	);

	return { data, error, loading, resolve, abort, getSignal };
}
