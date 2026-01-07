import { useIsFirstRender } from "@mantine/hooks";
import type { OAuthRequest } from "../../models/auth";
import { usePost } from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";
import { useLoadingOverlay } from "../../zustand/zustand";
import { useEffect } from "react";

export function AuthCallback({
	enabled,
}: {
	enabled?: boolean;
}) {
	const navigate = useNavigate();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const { data, loading, error, post } = usePost<Date, OAuthRequest>(
		"/api/auth"
	);
	const isEnabled = !!enabled;

	useEffect(() => {
		if (!isEnabled) {
			return;
		}
		setLoadingOverlayState(loading && isEnabled);
		if (loading) {
			return;
		}

		if (data) {
			navigate("/", { replace: true, flushSync: true });
		} else {
			navigate("/auth", { replace: true, flushSync: true });
		}
	}, [loading, data, navigate, error, isEnabled, setLoadingOverlayState]);

	if (useIsFirstRender() && isEnabled) {
		const params = new URLSearchParams(window.location.search);
		const authCode = params.get("code");
		const schoolId = params.get("school_id");

		if (!authCode || !schoolId) {
			navigate("/auth", { replace: true, flushSync: true });
			return <></>;
		}

		post({ authCode, schoolId });
	}

	return <></>;
}
