import { useCallback, useEffect, useRef, useState } from "react";

export function usePromise<TResult = never>() {
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

	const resolve = useCallback((promise?: Promise<TResult>) => {
		if (!promise) {
			return;
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
			})
			.finally(() => {
				if (!mountedRef.current || callId !== callIdRef.current) return;
				setLoading(false);
			});
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

	return { data, error, loading, resolve, abort, getSignal };
}
