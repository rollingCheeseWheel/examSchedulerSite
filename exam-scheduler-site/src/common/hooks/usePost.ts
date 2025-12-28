import { useCallback, useState } from "react";
import type { Result } from "../../models/result";
import { useAsync } from "./useAsync";

export function usePost<TResponse, TBody = unknown>(url: string | URL) {
	const [data, setData] = useState<Result<TResponse>>();
	const [error, setError] = useState<unknown>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const post = useCallback(
		async (
			body: TBody,
			options: RequestInit = {}
		): Promise<Result<TResponse> | undefined> => {
			try {
				const res = await getPost<TResponse, TBody>(url)(body, options);
				setData(res);
				return res;
			} catch (e) {
				setError(e);
			} finally {
				setLoading(false);
			}
		},
		[url]
	);

	return { data, error, loading, post };
}

function getPost<TResponse, TBody = unknown>(url: string | URL) {
	return async (
		body: TBody,
		options: RequestInit = {}
	): Promise<Result<TResponse>> => {
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
			const text = await res.text().catch(() => res.statusText);
			throw new Error(text || res.statusText || `HTTP ${res.status}`);
		}

		const text = await res.text();
		const json = JSON.parse(text, dateTimeReviver) as Result<TResponse>;
		return json;
	};
}

function dateTimeReviver(_: string, value: unknown) {
	if (typeof value === "string") {
		const d = new Date(value);
		if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
			return d;
		}
	}
	return value;
}
