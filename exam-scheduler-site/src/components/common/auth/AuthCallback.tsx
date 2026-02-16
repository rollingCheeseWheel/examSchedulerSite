import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { usePost } from "../../../hooks/usePost";
import { useSignalRInit } from "../../../hooks/useSignalR";
import type { OAuthRequest } from "../../../models/auth";
import type { UserProfile } from "../../../models/user";
import {
	useClassrooms,
	useCrossSiteError,
	useLoadingOverlay,
	useSchedules,
	useUserProfile,
} from "../../../zustand/zustand";

export function AuthCallback({ enabled }: { enabled?: boolean }) {
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const setUserProfile = useUserProfile((s) => s.setData);
	const setCrossSiteError = useCrossSiteError((s) => s.setData);
	const { data, loading, error, terminated, post, terminate } = usePost<
		UserProfile,
		OAuthRequest
	>(endpoints.auth.login);

	const { data: schedules, setData: setSchedules } = useSchedules();
	const { data: classrooms, setData: setClassrooms } = useClassrooms();
	const { init } = useSignalRInit();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const authCode = params.get("code");
		const schoolId = params.get("school_id");

		if (!authCode || !schoolId) {
			terminate();
		} else if (enabled) {
			post({ authCode, schoolId });
		}

		return terminate;
	}, [enabled, post, terminate]);

	useEffect(() => {
		setLoadingOverlayState(loading && !terminated && !!enabled);
	}, [enabled, loading, setLoadingOverlayState, terminated]);

	useEffect(() => {
		if (data && data.data) {
			setUserProfile(data.data);

			init({
				ReceiveInitialSchedules(schedules) {
					console.debug("received initial schedules", schedules);
					setSchedules(schedules);
				},
				UpdateSchedule(scheduleId, schedule) {
					console.debug("updating schedule", schedule);
					setSchedules([
						...schedules.filter((s) => s.id !== scheduleId),
						schedule,
					]);
				},
				RemoveSchedule(scheduleId) {
					console.debug("removing scheudule", scheduleId);
					setSchedules(schedules.filter((s) => s.id !== scheduleId));
				},
				ReceiveInitialClassrooms(classrooms) {
					console.debug("received initial classrooms", classrooms);
					setClassrooms(classrooms);
				},
				UpdateClassroom(classroom) {
					console.debug("updating classroom", classroom);
					setClassrooms([
						...classrooms.filter((c) => c.id !== classroom.id),
						classroom,
					]);
				},
			});
		}
	}, [
		classrooms,
		data,
		init,
		schedules,
		setClassrooms,
		setSchedules,
		setUserProfile,
	]);

	useEffect(() => {
		if (error && error.message) {
			setCrossSiteError(error.message);
		}
	}, [error, setCrossSiteError]);

	if (loading && !terminated) {
		return;
	} else if (data && data.data) {
		return <Navigate to={{ pathname: "/", search: "" }} replace />;
	} else {
		return <Navigate to={{ pathname: "/auth", search: "" }} replace />;
	}
}
