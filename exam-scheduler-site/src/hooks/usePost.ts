import { useCallback, useState } from "react";
import type { Result } from "../models/result";
import type { AxiosRequestConfig } from "axios";
import { api } from "../main";
import axios from "axios";

export function usePost<TResponse, TBody = unknown>(url: string | URL) {
	const [data, setData] = useState<Result<TResponse>>();
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState<boolean>(true);

	const [terminated, setTerminated] = useState<boolean>(false);

	function terminate() {
		setTerminated(true);
		setLoading(false);
	}

	const post = useCallback(
		async (
			body: TBody,
			options: AxiosRequestConfig = {},
		): Promise<Result<TResponse> | undefined> => {
			try {
				setLoading(true);
				setError(undefined);
				setData(undefined);
				const res = await getPost<TResponse, TBody>(url)(body, options);
				setData(res);
				return res;
			} catch (error) {
				if (error instanceof Error) {
					setError(error);
				}
				const formedError = new Error(
					`Non Error value was thrown: ${
						typeof error === "object"
							? JSON.stringify(error)
							: error
					}`,
				);
				setError(formedError);
				throw formedError;
			} finally {
				setLoading(false);
			}
		},
		[url],
	);

	return { data, error, loading, post, terminate, terminated };
}

export function getPost<TResponse, TBody = unknown>(url: string | URL) {
	return async (
		body: TBody | null | undefined = undefined,
		options: AxiosRequestConfig = {},
	): Promise<Result<TResponse>> => {
		const res = await api.post<Result<TResponse>>(
			url.toString(),
			body ?? undefined,
			{
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				transformResponse: [
					...(axios.defaults.transformResponse as []),
					(data: string) => {
						JSON.parse(data, jsonReviver) as Result<TResponse>;
					},
				],
				...options,
			},
		);

		const json = res.data;

		if (!json.success) {
			throw new Error(json.errors?.join(" | "));
		}

		return json;
	};
}

export const jsonReviver = reviverCombiner(dateReviver);

export function reviverCombiner(
	...revivers: ((key: string, value: unknown) => unknown)[]
) {
	function combinedReviver(key: string, value: unknown) {
		for (const reviver of revivers) {
			try {
				return reviver(key, value);
			} catch {}
		}
		return value;
	}

	return combinedReviver;
}

export function dateReviver(_: string, value: unknown) {
	if (typeof value === "string") {
		const d = new Date(value);
		if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
			return d;
		}
	}
	throw new Error();
}