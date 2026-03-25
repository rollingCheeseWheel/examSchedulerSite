import { useCallback, useEffect, useRef, useState } from "react";
import {
	singleOrList,
	type Action,
	type Func,
	type SingleOrList,
} from "../util";

export function usePromise<TResult = never>(
	loadingCallback?: SingleOrList<Action<[boolean]>>,
) {
	const [data, setData] = useState<TResult | undefined | null>();
	const [errors, setError] = useState<unknown[]>();
	const [loading, setLoading] = useState(false);

	const callIdRef = useRef(0);
	const mountedRef = useRef(true);
	const abortControllersRef = useRef<AbortController[]>([]);

	useEffect(() => {
		return () => {
			// WARNING + TODO: uncomment when in prod, only prevents un and remount issues from strictmode
			mountedRef.current = false;
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
		(
			promise?:
				| Promise<TResult | undefined>
				| Func<[AbortSignal], Promise<TResult>>,
		) => {
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
				})
				.catch((err) => {
					if (!mountedRef.current || callId !== callIdRef.current) return;
					setError(err);
					setData(undefined);
				})
				.finally(() => {
					if (!mountedRef.current || callId !== callIdRef.current) return;
					setLoading(false);
				});
		},
		[setLoading, getSignal],
	);

	useEffect(() => {
		const callbacks = singleOrList(loadingCallback);
		for (const callback of callbacks) {
			callback(loading);
		}
	}, [loading, loadingCallback]);

	return { data, errors, loading, resolve, abort, getSignal };
}
