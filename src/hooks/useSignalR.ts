import {
	HubConnectionBuilder,
	LogLevel,
	type HubConnection,
} from "@microsoft/signalr";
import { useCallback, useEffect, useRef } from "react";
import { endpoints } from "../endpoints";
import type { Classroom } from "../models/classroom";
import type { Result } from "../models/result";
import type {
	ExamSlotId,
	Schedule,
	ScheduleCreateRequest,
	ScheduleId,
} from "../models/schedule";
import type { SwapRequestId } from "../models/swapRequest";
import type { UserProfileId } from "../models/user";
import { type Action, type Func } from "../util";
import { useHubConnection } from "./zustand";

export interface ScheduleClient {
	onReceiveInitialSchedules: Action<[Schedule[]]>;
	onUpdateSchedule: Action<[ScheduleId, Schedule]>;
	onRemoveSchedule: Action<[ScheduleId]>;

	onReceiveInitialClassrooms: Action<[Classroom[]]>;
	onUpdateClassroom: Action<[Classroom]>;
}

export interface ScheduleHub {
	registerForSlot: Func<[ExamSlotId], Promise<Result<boolean>>>;

	createSwapRequest: Func<[ScheduleId, ExamSlotId], Promise<Result<boolean>>>;
	acceptSwapRequest: Func<[SwapRequestId], Promise<Result<boolean>>>;
	deleteSwapRequest: Func<[SwapRequestId], Promise<Result<boolean>>>;

	createSchedule: Func<[ScheduleCreateRequest], Promise<Result<boolean>>>;
	reportStudents: Func<[ExamSlotId, UserProfileId[]], Promise<Result<boolean>>>;

	connect: Func<[], Promise<void>>;
	disconnect: Func<[], Promise<void>>;
}

export function useSignalRInit(hubUrl: string = endpoints.scheduleHub) {
	const { data: connection, setData: setConnection } = useHubConnection();
	const handlersRef = useRef<ScheduleClient>(undefined);
	const connectionRef = useRef<HubConnection>(undefined);

	const init = useCallback(
		async (handlers: ScheduleClient) => {
			let conn = connection;

			if (!connection) {
				connectionRef.current = createConnection(hubUrl);
				console.debug("Connecting to hub");
				conn = {
					acceptSwapRequest(swaprequestId) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"AcceptSwapRequest",
								swaprequestId,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					createSchedule(request) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"CreateSchedule",
								request,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					createSwapRequest(scheduleId, userId) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"CreateSwapRequest",
								scheduleId,
								userId,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					deleteSwapRequest(swaprequestId) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"DeleteSwapRequest",
								swaprequestId,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					registerForSlot(slotId) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"RegisterForSlot",
								slotId,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					reportStudents(slotId, actualParticipants) {
						return (
							connectionRef.current?.invoke<Result<boolean>>(
								"ReportStudents",
								slotId,
								actualParticipants,
							) ?? Promise.reject(new Error("Connection not initialized"))
						);
					},
					connect() {
						return (
							connectionRef.current?.start() ??
							Promise.reject("Connection not initialized")
						);
					},
					disconnect() {
						return (
							connectionRef.current?.stop() ??
							Promise.reject("Connection not initialized")
						);
					},
				};

				if (handlersRef.current) {
					Object.entries(handlersRef.current).forEach(
						([eventName, handler]) => {
							connectionRef.current?.off(eventName.toLowerCase().replace(/^on/, ""), handler);
						},
					);
				}

				Object.entries(handlers).forEach(([eventName, handler]) => {
					connectionRef.current?.on(eventName.toLowerCase().replace(/^on/, ""), handler);
				});

				handlersRef.current = handlers;
				console.debug("updated event handlers")

				console.debug("Connecting to hub");
				await connectionRef.current.start();

				setConnection(conn);
			} else {
				if (handlersRef.current) {
					Object.entries(handlersRef.current).forEach(
						([eventName, handler]) => {
							connectionRef.current?.off(eventName, handler);
						},
					);
				}

				Object.entries(handlers).forEach(([eventName, handler]) => {
					connectionRef.current?.on(eventName, handler);
				});

				handlersRef.current = handlers;
				console.debug("updated event handlers")
			}
		},
		[hubUrl, connection, setConnection],
	);

	useEffect(() => {
		return () => {
			if (!connection || !handlersRef.current) return;
			Object.entries(handlersRef.current).forEach(([eventName, handler]) => {
				connectionRef.current?.off(eventName, handler);
			});
			handlersRef.current = undefined;
		};
	}, [connection]);

	return init;
}

function createConnection(hubUrl: string) {
	return new HubConnectionBuilder()
		.withUrl(hubUrl, {
			withCredentials: true,
		})
		.configureLogging(LogLevel.Debug)
		.withAutomaticReconnect()
		.build();
}
