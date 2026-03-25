import type { AxiosResponse } from "axios";
import { endpoints } from "../../../endpoints";
import { api } from "../../../main";
import type { Result } from "../../../models/result";

let refreshPromise: Promise<AxiosResponse<Result<Date>>> | null = null;

export function refreshSession() {
	if (!refreshPromise) {
		refreshPromise = api
			.post<Result<Date>>(endpoints.auth.refresh)
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}
