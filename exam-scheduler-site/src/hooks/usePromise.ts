import { useCallback, useEffect, useRef, useState } from "react";

export function usePromise<TResult = never>() {
	const [data, setData] = useState<TResult | undefined | null>();
	const [error, setError] = useState<unknown>();
	const [loading, setLoading] = useState(false);

	const callIdRef = useRef(0);
	const mountedRef = useRef(true);

	useEffect(() => {
		return () => {
			mountedRef.current = false;
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

	return { data, error, loading, resolve };
}
