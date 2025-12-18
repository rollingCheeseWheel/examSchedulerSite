import { useState, useCallback } from "react";
import type { Result } from "../models/result";
import { dateTimeReviver } from "./dateReviverFunction";

export function usePost<TResponse, TBody = unknown>(url: string | URL) {
	const [data, setData] = useState<Result<TResponse> | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const post = useCallback(
		async (
			body: TBody,
			options: RequestInit = {}
		): Promise<Result<TResponse>> => {
			setLoading(true);
			setError(null);

			try {
				const res = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(options.headers ?? {}),
					},
					body: JSON.stringify(body),
					...options,
				});

				if (!res.ok) {
					throw new Error(res.statusText);
				}

				const text = await res.text();
				const json = JSON.parse(
					text,
					dateTimeReviver
				) as Result<TResponse>;
				setData(json);
				return json;
			} catch (e) {
				const err = e instanceof Error ? e : new Error("Unknown error");
				setError(err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[url]
	);

	return { post, data, error, loading };
}
