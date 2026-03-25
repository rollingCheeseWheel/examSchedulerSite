import { type AxiosRequestConfig, AxiosError } from "axios";
import { api } from "../main";
import type { Brand } from "./brand";

export type HttpStatusCode = Brand<number, "statuscode">;

export interface Result<T> {
	statuscode: number;
	data?: T;
	errors?: string[];
}

export async function apiRequest<T>(
	config: AxiosRequestConfig,
): Promise<Result<T>> {
	try {
		const response = await api.request<T>(config);
		return {
			statuscode: response.status,
			data: response.data,
		};
	} catch (err) {
		if (!(err instanceof AxiosError)) throw err;

		if (err.response) {
			return {
				statuscode: err.response.status,
				errors:
					Array.isArray(err.response.data) ?
						err.response.data
					:	[err.response.data?.toString() || "Unknown error"],
			};
		}
		return {
			statuscode: 500,
			errors: [err.message || "Unknown error"],
		};
	}
}
