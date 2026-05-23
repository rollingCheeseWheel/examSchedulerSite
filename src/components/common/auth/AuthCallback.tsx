import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { usePromise } from "../../../hooks/usePromise";
import { useSignalRInit, type ScheduleClient } from "../../../hooks/useSignalR";
import {
	useClassrooms,
	useHubConnection,
	useSchedules,
	useUserProfile,
} from "../../../hooks/zustand";
import { api, setTokenDuration } from "../../../main";
import { type DateString } from "../../../models/brand";
import type { Result } from "../../../models/result";
import type { UserProfile } from "../../../models/user";

export function AuthCallback() {
	const [isLoggedIn, setSessionEnd] = useIsLoggedIn();
	const navigate = useNavigate();
	const { resolve: resolveDisconnect } = usePromise();
	const { init, updateHandlers } = useSignalRInit();
	const _connection = useHubConnection((s) => s.data);
	const connectionRef = useRef(_connection);
	const { resolve } = usePromise({
		onError: useCallback(() => {
			setSessionEnd(0);
			navigate({ pathname: "/auth", search: "" }, { replace: true });
			resolveDisconnect(connectionRef.current?.disconnect());
		}, [navigate, resolveDisconnect, setSessionEnd]),
		onSuccess: useCallback(
			() => navigate({ pathname: "/", search: "" }, { replace: true }),
			[navigate],
		),
	});

	useEffect(() => {
		connectionRef.current = _connection;
	}, [_connection]);

	const setSchedule = useSchedules((s) => s.set);
	const removeSchedule = useSchedules((s) => s.removeKey);
	const setClassroom = useClassrooms((s) => s.set);

	const setUserProfile = useUserProfile((s) => s.setData);

	const handlers = useMemo<ScheduleClient>(
		() => ({
			InitialSchedules(schedules) {
				console.debug("schedules", schedules);
				setSchedule(...schedules);
			},
			ScheduleCreated(scheduleId) {
				console.debug("schedule created", scheduleId);
				resolve(connectionRef.current?.subscribeSchedule(scheduleId));
			},
			ScheduleUpdated(schedule) {
				console.debug("schedule update", schedule);
				setSchedule(schedule);
			},
			ScheduleRemoved(scheduleId) {
				console.debug("removing schedule", scheduleId);
				removeSchedule(scheduleId);
			},
			InitialClassrooms(classrooms) {
				console.debug("classrooms", classrooms);
				setClassroom(...classrooms);
			},
			ClassroomUpdated(classroom) {
				console.debug("classroom updated", classroom);
				setClassroom(classroom);
			},
		}),
		[connectionRef, removeSchedule, resolve, setClassroom, setSchedule],
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => init(handlers), []);

	useEffect(
		() => {
			const queryParams = new URLSearchParams(window.location.search);
			const authCode = queryParams.get("code");
			const schoolId = queryParams.get("school_id");

			if (!authCode && !schoolId && !isLoggedIn) {
				resolve(Promise.reject());
				return;
			}

			if (isLoggedIn) {
				resolve(
					(signal) =>
						api<Result<UserProfile>>(endpoints.auth.me, {
							method: "GET",
							signal,
						}),
					{
						onSuccess: (res) => {
							setUserProfile(res.data);
							setSessionEnd(Date.now() + 1_000 * 60 * 60);
							resolve(connectionRef.current?.connect() ?? Promise.reject());
						},
					},
				);
				return;
			}

			resolve(
				(signal) =>
					api<Result<DateString>>(endpoints.auth.login, {
						method: "POST",
						body: { authCode, schoolId },
						signal,
					}),
				{
					onSuccess: (res) => {
						if (!res.data) {
							console.error("error during login");
							return;
						}
						setTokenDuration(new Date(res.data).getTime() - Date.now());
						setSessionEnd(new Date(res.data).getTime());
						resolve(
							(signal) =>
								api<Result<UserProfile>>(endpoints.auth.me, {
									method: "GET",
									signal,
								}),
							{
								onSuccess: (res) => {
									setUserProfile(res.data);
									resolve(connectionRef.current?.connect() ?? Promise.reject());
								},
							},
						);
					},
				},
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			/* isLoggedIn, resolve, setSessionEnd, setUserProfile */
		],
	);

	useEffect(() => updateHandlers(handlers), [handlers, updateHandlers]);

	return <></>;
}
