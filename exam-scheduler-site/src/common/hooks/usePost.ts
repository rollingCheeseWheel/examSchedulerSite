import type { Result } from "../../models/result";
import { dateTimeReviver } from "../dateReviverFunction";
import { useAsync } from "./useAsync";

export function usePost<TResponse, TBody = unknown>(
	url: string | URL,
	body: TBody,
	requestOptions: RequestInit = {},
	instantFetch: boolean = false
) {
	return useAsync(
		getPost<TResponse, TBody>(url),
		[body, requestOptions],
		[],
		instantFetch
	);
}

export function getPost<TResponse, TBody = unknown>(url: string | URL) {
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
			throw new Error(res.statusText);
		}

		const text = await res.text();
		const json = JSON.parse(text, dateTimeReviver) as Result<TResponse>;
		return json;
	};
}
