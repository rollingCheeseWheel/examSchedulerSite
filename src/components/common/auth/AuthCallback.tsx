import { type AxiosResponse } from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useGenericError } from "../../../hooks/useGenericError";
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
	const { data, loading, resolve, abort, error } = usePromise<
		AxiosResponse<Result<UserProfile>>
	>({
		loadingCallbacks: setLoadingOverlayState,
		errorCallbacks: useGenericError(),
	});
	const navigate = useNavigate();

	const authenticatedRef = useRef(false);

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
		usePromise<void>({
			loadingCallbacks: setLoadingOverlayState,
			errorCallbacks: useGenericError(),
		});
	const initSignalR = useSignalRInit();

	useEffect(abort, [abort]);
	useEffect(abortSignalRInit, [abortSignalRInit]);

	useEffect(() => {
		const authCode = searchParams.get("code");
		const schoolId = searchParams.get("school_id");

		if (!authCode || !schoolId || authenticatedRef.current) {
			return;
		} else if (!props.disabled) {
			authenticatedRef.current = true;
			resolve((s) => {
				const promise = apiRequest<UserProfile>({
					url: endpoints.auth.login,
					method: "POST",
					data: { authCode, schoolId },
					signal: s,
				});
				return promise;
			});
		}

		return;
	}, [props.disabled, resolve, searchParams]);

	useEffect(() => {
		if (loading) {
			return;
		}

		if (data?.data.data) {
			navigate({ pathname: "/", search: "" }, { replace: true });
		} else {
			navigate({ pathname: "/auth", search: "" }, { replace: true });
		}
	}, [data, error, loading, navigate]);

	useEffect(() => {
		if (data && data.data && data.data.data) {
			setUserProfile(data.data.data);

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

	return <></>;
}
