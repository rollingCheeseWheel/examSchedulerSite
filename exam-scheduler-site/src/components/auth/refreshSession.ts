import { endpoints } from "../../endpoints";
import { getPost } from "../../hooks/usePost";
import type { Result } from "../../models/result";

let refreshPromise: Promise<Result<Date>> | null = null;

export function refreshSession(): Promise<Result<Date>> {
	if (!refreshPromise) {
		refreshPromise = getPost<Date>(endpoints.auth.refresh)().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}
