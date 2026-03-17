import { useEffect, useState } from "react";
import { useLatch } from "./useLatch";

export function useAsync<TArgs extends readonly never[], TResult>(
	fun: (...args: TArgs) => Promise<TResult>,
	args: TArgs,
	instantFetch: boolean = false,
) {
	const [data, setData] = useState<TResult | null | undefined>();
	const [error, setError] = useState<unknown>(undefined);
	const [loading, setLoading] = useState(false);
	const { value: fetch, setLatch } = useLatch(instantFetch);
	const { value: terminated, setLatch: setTerminated } = useLatch(false);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			setError(undefined);

			try {
				const result = await fun(...args);
				if (!cancelled && !terminated) setData(result);
			} catch (e) {
				if (!cancelled && !terminated) setError(e);
			} finally {
				if (!cancelled && !terminated) setLoading(false);
			}
		};

		if (fetch && !cancelled && !terminated) {
			run();
		}

		return () => {
			cancelled = true;
			setTerminated(true);
		};
	}, [args, fetch, fun, setTerminated, terminated]);

	return {
		data,
		error,
		loading,
		fetch: () => setLatch(true),
	};
}
