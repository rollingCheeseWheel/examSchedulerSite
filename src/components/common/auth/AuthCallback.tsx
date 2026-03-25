import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { usePromise } from "../../../hooks/usePromise";
import { useSignalRInit } from "../../../hooks/useSignalR";
import {
	useClassrooms,
	useLoadingOverlay,
	useSchedules,
	useUserProfile,
} from "../../../hooks/zustand";
import { apiRequest, type Result } from "../../../models/result";
import type { UserProfile } from "../../../models/user";

export function AuthCallback(props: { disabled?: boolean }) {
	const [searchParams] = useSearchParams();
	const setLoadingOverlayState = useLoadingOverlay((s) => s.setState);
	const setUserProfile = useUserProfile((s) => s.setData);
	const { data, loading, resolve, abort } = usePromise<Result<UserProfile>>(
		setLoadingOverlayState,
	);

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
	const { resolve: resolveSignalRInit, abort: abortSignalRInit } =
		usePromise<void>(setLoadingOverlayState);
	const initSignalR = useSignalRInit();

	useEffect(abort, [abort]);
	useEffect(abortSignalRInit, [abortSignalRInit]);

	useEffect(() => {
		const authCode = searchParams.get("code");
		const schoolId = searchParams.get("school_id");

		if (!authCode || !schoolId) {
			return;
		} else if (!props.disabled) {
			resolve((s) =>
				apiRequest<UserProfile>({
					method: "POST",
					data: { authCode, schoolId },
					signal: s,
				}),
			);
		}

		return;
	}, [props.disabled, resolve, searchParams]);

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
							setSchedule(iterSchedule);
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
	}, [
		classroomMap,
		classroomsAsArray,
		data,
		initSignalR,
		resolveSignalRInit,
		scheduleMap,
		schedulesAsArray,
		setClassroom,
		setSchedule,
		setUserProfile,
	]);

	if (loading) {
		return;
	} else if ((data && data.data) || props.disabled) {
		return <Navigate to={{ pathname: "/", search: "" }} replace />;
	} else {
		return <Navigate to={{ pathname: "/auth", search: "" }} replace />;
	}
}
