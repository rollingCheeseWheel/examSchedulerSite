import { useMounted } from "@mantine/hooks";
import type { OAuthRequest } from "../models/auth";
import { usePost } from "../common/hooks/usePost";
import { useLoadingOverlay } from "../common/providers/LoadingOverlayProvider";
import { useNavigate } from "react-router-dom";

export function AuthCallback() {
	const { setState, state } = useLoadingOverlay();
	const mounted = useMounted();
	const navigate = useNavigate();

	const params = new URLSearchParams(window.location.search);
	const [authCode, schoolId] = [params.get("code"), params.get("school_id")];

	if (mounted) {
		navigate("/auth");
		if (authCode && schoolId) {
			const authRequest: OAuthRequest = {
				authCode: authCode,
				schoolId: schoolId,
			};
			return ActualAuthCallback(authRequest);
		}
	}
}

function ActualAuthCallback(authRequest: OAuthRequest) {
	const { data, error, loading } = usePost<Date, OAuthRequest>(
		"/api/auth",
		authRequest,
		undefined,
		true
	);
	// TODO: return navigate component
}
