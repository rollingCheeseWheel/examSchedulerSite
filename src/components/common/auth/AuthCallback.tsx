import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../../endpoints";
import { useLoadingPromise } from "../../../hooks/useLoadingPromise";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useSignalRInit } from "../../../hooks/useSignalR";
import {
	useClassrooms,
	useLoadingOverlay,
	useSchedules,
	useUserProfile,
} from "../../../hooks/zustand";
import { api } from "../../../main";
import type { AuthResponse } from "../../../models/auth";
import { type DateString, type DateNumber } from "../../../models/brand";
import type { Result } from "../../../models/result";

export function AuthCallback({ disabled }: { disabled?: boolean }) {
	const setLoadingOverlay = useLoadingOverlay((s) => s.setState);
	const [authExpires, setAuthExpires] = useLocalStorage<DateNumber>(
		"sessionEnd",
		Date.now() + 1000 * 60 * 5, // 5 minutes
	);
	const navigate = useNavigate();
	const { resolve } = useLoadingPromise({
		onLoading: setLoadingOverlay,
		onError: () =>
			navigate({ pathname: "/auth", search: "" }, { replace: true }),
	});
	const initSignalR = useSignalRInit();
	const { asArray: schedulesAsArray, set: setSchedule } = useSchedules();
	const { asArray: classroomsAsArray, set: setClassroom } = useClassrooms();
	const setUserProfile = useUserProfile((s) => s.setData);

	useEffect(() => {
		if (disabled) {
			console.log("login disabled");

			return;
		}

		if (authExpires && authExpires >= Date.now()) {
			resolve(
				api<Result<DateString>>(endpoints.auth.refresh, { method: "POST" }),
				{
					onSuccess: (res) => {
						if (!res.data)
						{
							return;
						}
						
					}
				}
			);
			console.log("auth expired, atempting to reauthenticate");
			return;
		}

		const queryParams = new URLSearchParams(window.location.search);
		const authCode = queryParams.get("code");
		const schoolId = queryParams.get("school_id");
		if (!authCode || !schoolId) {
			navigate({ pathname: "/auth", search: "" }, { replace: true });
			console.log(
				"auth code or school_id not present, redirecting to auth page",
				{
					authCode,
					schoolId,
				},
			);
			return;
		}

		console.log("logging in", { authCode, schoolId });
		resolve(
			api<Result<AuthResponse>>(endpoints.auth.login, {
				method: "POST",
				body: { authCode, schoolId },
			}),
			{
				onError: () => {
					console.error("error during authentication");
				},
				onSuccess: (res) => {
					if (!res.data) {
						console.warn("error during login");
						return;
					}
					console.log("successfully logged in, initiating signalr", res);
					setAuthExpires(new Date(res.data.expiration).getTime());
					setUserProfile(res.data.user);
					resolve(
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
								console.debug("removing schedule", scheduleId);
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
						{
							onSuccess: () => console.log("initiated signalr"),
							onError: () => console.error("error during signalr init"),
						},
					);
					navigate({ pathname: "/", search: "" }, { replace: true });
				},
			},
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
