import { useCallback, useEffect, useRef, useState } from "react";
import {
	singleOrList,
	type Action,
	type Func,
	type SingleOrList,
} from "../util";
import type { ActionIconCssVariables } from "@mantine/core";

interface UsePromiseCallbacks<TResult, TError = unknown> {
	loadingCallbacks?: SingleOrList<Action<[boolean]>>;
	errorCallbacks?: SingleOrList<Action<[TError]>>;
	successCallbacks?: SingleOrList<Action<[TResult]>>;
}

export function usePromise<TResult, TError = unknown>(
	callbacks?: UsePromiseCallbacks<TResult, TError>,
) {
	const [data, setData] = useState<TResult | undefined | null>();
	const [error, setError] = useState<TError>();
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

			setData(undefined);
			setError(undefined);
			setLoading(true);

			promise
				.then((result) => {
					setData(result);
				})
				.catch((err) => {
					setError(err);
					setData(undefined);
				})
				.finally(() => {
					setLoading(false);
				});
		},
		[setLoading, getSignal],
	);

	useEffect(() => {
		const loadingCallbacks = singleOrList(callbacks?.loadingCallbacks);
		for (const callback of loadingCallbacks) {
			callback(loading);
		}
	}, [callbacks?.loadingCallbacks, loading]);

	useEffect(() => {
		if (!error) {
			return;
		}
		const errorCallbacks = singleOrList(callbacks?.errorCallbacks);
		for (const callback of errorCallbacks) {
			callback(error);
		}
	}, [callbacks?.errorCallbacks, error, loading]);

	useEffect(() => {
		if (!data) {
			return;
		}
		const successCallbacks = singleOrList(callbacks?.successCallbacks);
		for (const callback of successCallbacks) {
			callback(data);
		}
	}, [callbacks?.successCallbacks, data, loading]);

	return { data, error, loading, resolve, abort, getSignal };
}
