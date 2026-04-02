import { endpoints } from "../../../endpoints";
import { api } from "../../../main";
import type { Result } from "../../../models/result";

let refreshPromise: Promise<Result<Date>> | undefined = undefined;

export function refreshSession() {
	if (!refreshPromise) {
		refreshPromise = api<Result<Date>>(endpoints.auth.refresh, {
			method: "POST",
		}).finally(() => {
			refreshPromise = undefined;
		});
	}
	return refreshPromise;
}
