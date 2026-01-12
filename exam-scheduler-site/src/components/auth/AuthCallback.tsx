import { useIsFirstRender } from "@mantine/hooks";
import type { OAuthRequest } from "../../models/auth";
import { usePost } from "../../hooks/usePost";
import { Navigate } from "react-router-dom";
import { useCrossSiteError, useLoadingOverlay, useUserProfile } from "../../zustand/zustand";
import type { ReactNode } from "react";
import type { UserProfile } from "../../models/user";

export function AuthCallback({ enabled }: { enabled?: boolean }) {
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const setUserProfile = useUserProfile((s) => s.setData);
	const setCrossSiteError = useCrossSiteError((s) => s.setData);
	const { data, loading, error, terminated, post, terminate } = usePost<
		UserProfile,
		OAuthRequest
	>("/api/auth");

	if (useIsFirstRender() && enabled) {
		const params = new URLSearchParams(window.location.search);
		const authCode = params.get("code");
		const schoolId = params.get("school_id");

		if (!authCode || !schoolId) {
			terminate();
		} else if (enabled) {
			post({ authCode, schoolId });
		}
	}

	setLoadingOverlayState(loading && !terminated && !!enabled);
	if (loading && !terminated) {
		return <></>;
	} else if (data) {
		setUserProfile(data.data)
		return <></>;
	} else {
		setCrossSiteError(error?.message);
		return <Navigate to="/auth" replace />;
	}
}
