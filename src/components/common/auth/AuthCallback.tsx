import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { useLoadingPromise } from "../../../hooks/useLoadingPromise";
import { useSignalRInit } from "../../../hooks/useSignalR";
import {
	useClassrooms,
	useHubConnection,
	useLoadingOverlay,
	useSchedules,
	useUserProfile,
} from "../../../hooks/zustand";
import { api, setTokenDuration } from "../../../main";
import { type DateString } from "../../../models/brand";
import type { Result } from "../../../models/result";
import type { UserProfile } from "../../../models/user";

export function AuthCallback() {
	const setLoadingOverlay = useLoadingOverlay((s) => s.setState);
	const [isLoggedIn, setSessionEnd] = useIsLoggedIn();
	const navigate = useNavigate();
	const { resolve } = useLoadingPromise({
		onLoading: setLoadingOverlay,
		onError: () =>
			navigate({ pathname: "/auth", search: "" }, { replace: true }),
	});
	const initSignalR = useSignalRInit();
	const connection = useHubConnection((s) => s.data);
	const setSchedule = useSchedules((s) => s.set);
	const removeSchedule = useSchedules((s) => s.removeKey);
	const setClassroom = useClassrooms((s) => s.set);
	const setUserProfile = useUserProfile((s) => s.setData);
	const userprofileHasChanged = useUserProfile((s) => s.hasChanged);

	const boundSignalRInit = useCallback(
		() =>
			initSignalR({
				onReceiveInitialSchedules(schedules) {
					console.debug("schedules", schedules);
					setSchedule(...schedules);
				},
				onScheduleCreated(scheduleId) {
					console.debug("schedule created", scheduleId);
					resolve(
						connection?.subscribeSchedule(scheduleId) ??
							Promise.reject(new Error("connection not initialized")),
					);
				},
				onUpdateSchedule(schedule) {
					console.debug("schedule update", schedule);
					setSchedule(schedule);
				},
				onRemoveSchedule(scheduleId) {
					console.debug("removing schedule", scheduleId);
					removeSchedule(scheduleId);
				},
				onReceiveInitialClassrooms(classrooms) {
					console.debug("classrooms", classrooms);
					setClassroom(...classrooms);
				},
				onUpdateClassroom(classroom) {
					console.debug("classroom updated", classroom);
					setClassroom(classroom);
				},
			}),
		[
			initSignalR,
			setSchedule,
			resolve,
			connection,
			removeSchedule,
			setClassroom,
		],
	);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const authCode = queryParams.get("code");
		const schoolId = queryParams.get("school_id");

		if ((!authCode || !schoolId) && !isLoggedIn) {
			navigate({ pathname: "/auth", search: "" }, { replace: true });
			return;
		}

		if (!userprofileHasChanged && isLoggedIn && !authCode && !schoolId) {
			resolve(
				api<Result<UserProfile>>(endpoints.auth.me, {
					method: "GET",
				}),
				{
					onSuccess: (res) => {
						setUserProfile(res.data);
						setSessionEnd(Date.now() + 1_000 * 60 * 60);
					},
					onError: () => {
						console.error("failed to get userprofile");
						setSessionEnd(0);
						navigate({ pathname: "/auth", search: "" }, { replace: true });
					},
				},
			);
			resolve(boundSignalRInit(), {
				onError: () => {
					console.error("error during signalr init");
					setSessionEnd(0);
					navigate({ pathname: "/auth", search: "" }, { replace: true });
				},
			});
			return;
		}

		if (!isLoggedIn) {
			resolve(
				api<Result<DateString>>(endpoints.auth.login, {
					method: "POST",
					body: { authCode, schoolId },
				}),
				{
					onError: () =>
						navigate({ pathname: "/auth", search: "" }, { replace: true }),
					onSuccess: (res) => {
						if (!res.data) {
							console.error("error during login");
							return;
						}
						setTokenDuration(new Date(res.data).getTime() - Date.now());
						setSessionEnd(new Date(res.data).getTime());
						resolve(
							api<Result<UserProfile>>(endpoints.auth.me, {
								method: "GET",
							}),
							{
								onSuccess: (res) => {
									setUserProfile(res.data);
								},
								onError: () => {
									console.error("failed to get userprofile");
									setSessionEnd(0);
									navigate(
										{ pathname: "/auth", search: "" },
										{ replace: true },
									);
								},
							},
						);
						resolve(boundSignalRInit(), {
							onError: () => {
								setSessionEnd(0);
								navigate({ pathname: "/auth", search: "" }, { replace: true });
							},
						});
						navigate({ pathname: "/", search: "" }, { replace: true });
					},
				},
			);
			return;
		}

		resolve(boundSignalRInit(), {
			onError: () => {
				setSessionEnd(0);
				navigate({ pathname: "/auth", search: "" }, { replace: true });
			},
		});
	}, [
		boundSignalRInit,
		isLoggedIn,
		navigate,
		resolve,
		setSessionEnd,
		setUserProfile,
		userprofileHasChanged,
	]);

	return <></>;
}
