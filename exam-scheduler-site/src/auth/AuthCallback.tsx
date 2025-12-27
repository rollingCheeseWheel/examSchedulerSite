import { useIsFirstRender } from "@mantine/hooks";
import type { OAuthRequest } from "../models/auth";
import { usePost } from "../common/hooks/usePost";
import { useNavigate } from "react-router-dom";
import { useLoadingOverlay } from "../common/zustand/zustand";

export function AuthCallback() {
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const navigate = useNavigate();
	const { data, error, loading, post } = usePost<Date, OAuthRequest>(
		"/api/auth"
	);

	if (useIsFirstRender()) {
		navigate("/auth");
		const params = new URLSearchParams(window.location.search);
		const [authCode, schoolId] = [
			params.get("code"),
			params.get("school_id"),
		];
		if (!authCode || !schoolId) {
			return null;
		}

		const oAuthRequest: OAuthRequest = {
			authCode: authCode,
			schoolId: schoolId,
		};

		post(oAuthRequest);
	}

	setLoadingOverlayState(loading);
	
	if (data) {
		navigate("/");
	}
}
