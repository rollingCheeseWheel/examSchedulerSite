import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { usePromise } from "../../../hooks/usePromise";
import { useSignalRInit } from "../../../hooks/useSignalR";
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
	const { init } = useSignalRInit();
	const _connection = useHubConnection((s) => s.data);
	const connectionRef = useRef(_connection);
	useEffect(() => {
		connectionRef.current = _connection;
	}, [_connection]);
	const { resolve } = usePromise({
		onError: useCallback(() => {
			setSessionEnd(0);
			navigate({ pathname: "/auth", search: "" }, { replace: true });
			connectionRef.current?.disconnect();
		}, [navigate, setSessionEnd]),
		onSuccess: useCallback(
			() => navigate({ pathname: "/", search: "" }, { replace: true }),
			[navigate],
		),
	});

	const setSchedule = useSchedules((s) => s.set);
	const removeSchedule = useSchedules((s) => s.removeKey);
	const setClassroom = useClassrooms((s) => s.set);

	const setUserProfile = useUserProfile((s) => s.setData);

	useEffect(
		() =>
			init({
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
		[connectionRef, init, removeSchedule, resolve, setClassroom, setSchedule],
	);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const authCode = queryParams.get("code");
		const schoolId = queryParams.get("school_id");

		if (!isLoggedIn) {
			if (!authCode || !schoolId) {
				resolve(Promise.reject("OAuth credentials missing"));
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
							resolve(Promise.reject("Error during login"));
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
		} else {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [/* isLoggedIn,  */ resolve, setSessionEnd, setUserProfile]);

	return <></>;
}
