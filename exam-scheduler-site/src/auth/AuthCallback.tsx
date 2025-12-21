import { useMounted } from "@mantine/hooks";
import type { OAuthRequest } from "../models/auth";
import { usePost } from "../common/usePost";
import { useLoadingOverlay } from "../common/providers/LoadingOverlayProvider";
import { useNavigate } from "react-router-dom";
import { useAsync } from "../common/useAsync";

export function AuthCallback() {
	const { post, data, error, loading } = usePost<Date, OAuthRequest>("/api/auth");
	const { setState, state } = useLoadingOverlay();
	const mounted = useMounted();
	const navigate = useNavigate();

	if (mounted) {
		const params = new URLSearchParams(window.location.search);
		const [authCode, schoolId] = [
			params.get("code"),
			params.get("school_id"),
		];
		navigate("/auth");
		if (!authCode || !schoolId) return;

		const authRequest: OAuthRequest = {
			authCode: authCode,
			schoolId: schoolId,
		};

		// useAsync(post, [authRequest]);
	}
}
