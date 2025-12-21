import { useState, useEffect } from "react";

export function useAsync<T, A extends readonly unknown[]>(
	fun: (...args: A) => Promise<T>,
	args: A,
	dependencies: readonly unknown[] = []
) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<unknown>(null);
	const [loading, setLoading] = useState<boolean>(false);

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

		run();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return { data, error, loading };
}
