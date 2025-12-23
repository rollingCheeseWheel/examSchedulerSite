import { useState, useEffect } from "react";
import { useLatch } from "./useLatch";

export function useAsync<TArgs extends readonly unknown[], TResult>(
	fun: (...args: TArgs) => Promise<TResult>,
	args: TArgs,
	dependencies: readonly unknown[] = [],
	instantFetch: boolean = false
) {
	const [data, setData] = useState<TResult | null>(null);
	const [error, setError] = useState<unknown>(null);
	const [loading, setLoading] = useState(false);
	const [fetch, { setLatch }] = useLatch(instantFetch);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			setError(null);

			try {
				const result = await fun(...args);
				if (!cancelled) setData(result);
			} catch (e) {
				if (!cancelled) setError(e);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		if (fetch) {
			run();
		}

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies, fetch]);

	return {
		data,
		error,
		loading,
		fetch: () => setLatch(true),
	};
}
