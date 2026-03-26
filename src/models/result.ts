import { type AxiosRequestConfig, type AxiosResponse, AxiosError } from "axios";
import { api } from "../main";
import type { Brand } from "./brand";

export type HttpStatusCode = Brand<number, "statuscode">;

export interface NonGenericResult {
	errors?: string[];
}

export interface Result<T> extends NonGenericResult {
	data?: T;
}

export async function apiRequest<T>(
	config: AxiosRequestConfig,
): Promise<AxiosResponse<Result<T>>> {
	return await api.request<Result<T>>(config);
}
