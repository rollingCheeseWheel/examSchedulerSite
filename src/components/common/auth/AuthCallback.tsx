import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { usePost } from "../../../hooks/usePost";
import { usePromise } from "../../../hooks/usePromise";
import { useSignalRInit } from "../../../hooks/useSignalR";
import type { OAuthRequest } from "../../../models/auth";
import type { UserProfile } from "../../../models/user";
import {
	useClassrooms,
	useCrossSiteError,
	useLoadingOverlay,
	useSchedules,
	useUserProfile,
} from "../../../zustand";

export function AuthCallback(props: { disabled?: boolean }) {
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const setUserProfile = useUserProfile((s) => s.setData);
	const setCrossSiteError = useCrossSiteError((s) => s.setData);
	const { data, loading, error, terminated, post, terminate } = usePost<
		UserProfile,
		OAuthRequest
	>(endpoints.auth.login);

	const {
		asMap: scheduleMap,
		set: setSchedule,
		asArray: schedulesAsArray,
	} = useSchedules();
	const {
		asMap: classroomMap,
		set: setClassroom,
		asArray: classroomsAsArray,
	} = useClassrooms();
	const {
		resolve: resolveSignalRInit,
		loading: signalRInitLoading,
		abort: abortSignalRInit,
	} = usePromise<void>();
	const initSignalR = useSignalRInit();

	useEffect(() => {
		setLoadingOverlayState(signalRInitLoading);
		return abortSignalRInit;
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const authCode = params.get("code");
		const schoolId = params.get("school_id");

		if (!authCode || !schoolId) {
			terminate();
		} else if (!props.disabled) {
			post({ authCode, schoolId });
		}

		return terminate;
	}, [props, post, terminate]);

	useEffect(() => {
		setLoadingOverlayState(loading && !terminated && (props.disabled ?? false));
	}, [props, loading, setLoadingOverlayState, terminated]);

	useEffect(() => {
		if (data && data.data) {
			setUserProfile(data.data);

			resolveSignalRInit(
				initSignalR({
					onReceiveInitialSchedules(schedules) {
						console.debug("received initial schedules", schedules);
						for (const schedule of schedules) {
							setSchedule(schedule);
						}
					},
					onUpdateSchedule(scheduleId, schedule) {
						console.debug("updating schedule", schedule);
						for (const iterSchedule of [
							...schedulesAsArray.filter((s) => s.id !== scheduleId),
							schedule,
						]) {
						}
					},
					onRemoveSchedule(scheduleId) {
						console.debug("removing scheudule", scheduleId);
						for (const schedule of schedulesAsArray.filter(
							(s) => s.id !== scheduleId,
						)) {
							setSchedule(schedule);
						}
					},
					onReceiveInitialClassrooms(classrooms) {
						console.debug("received initial classrooms", classrooms);
						for (const classroom of classrooms) {
							setClassroom(classroom);
						}
					},
					onUpdateClassroom(classroom) {
						console.debug("updating classroom", classroom);
						for (const iterClassroom of [
							...classroomsAsArray.filter((c) => c.id !== classroom.id),
							classroom,
						]) {
							setClassroom(iterClassroom);
						}
					},
				}),
			);
		}
		return abortSignalRInit;
	}, [
		abortSignalRInit,
		classroomMap,
		data,
		initSignalR,
		resolveSignalRInit,
		scheduleMap,
		setClassroom,
		setSchedule,
		setUserProfile,
	]);

	useEffect(() => {
		if (error && error.message) {
			setCrossSiteError(error.message);
		}
	}, [error, setCrossSiteError]);

	if (loading && !terminated) {
		return;
	} else if ((data && data.data) || props.disabled) {
		return <Navigate to={{ pathname: "/", search: "" }} replace />;
	} else {
		return <Navigate to={{ pathname: "/auth", search: "" }} replace />;
	}
}
