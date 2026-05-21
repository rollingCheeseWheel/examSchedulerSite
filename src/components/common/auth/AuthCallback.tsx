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

export function AuthCallback({ disabled }: { disabled?: boolean }) {
	const setLoadingOverlay = useLoadingOverlay((s) => s.setState);
	const [isLoggedIn, setSessionEnd] = useIsLoggedIn();
	const navigate = useNavigate();
	const { resolve } = useLoadingPromise({
		onLoading: setLoadingOverlay,
		onError: () =>
			navigate({ pathname: "/auth", search: "" }, { replace: true }),
	});
	const initSignalR = useSignalRInit();
	const connection = useHubConnection(s => s.data);
	const setSchedule = useSchedules((s) => s.set);
	const removeSchedule = useSchedules((s) => s.removeKey);
	const setClassroom = useClassrooms((s) => s.set);
	const setUserProfile = useUserProfile((s) => s.setData);

	const boundSignalRInit = useCallback(
		() =>
			initSignalR({
				onReceiveInitialSchedules(schedules) {
					console.debug("schedules", schedules);
					setSchedule(...schedules);
				},
				onScheduleCreated(scheduleId) {
					console.debug("schedule created", scheduleId)
					resolve(connection?.subscribeSchedule(scheduleId) ?? Promise.reject(new Error("connection not initialized")));
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
			setClassroom,
			setSchedule,
			connection
		],
	);

	useEffect(() => {
		if (disabled) {
			return;
		}

		const queryParams = new URLSearchParams(window.location.search);
		const authCode = queryParams.get("code");
		const schoolId = queryParams.get("school_id");

		if (isLoggedIn && !authCode && !schoolId) {
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
						navigate("/auth");
					},
				},
			);
			resolve(boundSignalRInit(), {
				onError: () => {
					console.error("error during signalr init");
					setSessionEnd(0);
					navigate("/auth");
				},
			});
			return;
		}

		if (!authCode || !schoolId) {
			navigate({ pathname: "/auth", search: "" }, { replace: true });
			return;
		}

		resolve(
			api<Result<DateString>>(endpoints.auth.login, {
				method: "POST",
				body: { authCode, schoolId },
			}),
			{
				onError: () => {
					console.error("error during authentication");
				},
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
								navigate("/auth");
							},
						},
					);
					resolve(boundSignalRInit(), {
						onError: () => {
							console.error("error during signalr init");
							setSessionEnd(0);
							navigate("/auth");
						},
					});
					navigate({ pathname: "/", search: "" }, { replace: true });
				},
			},
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
