import { HubConnectionBuilder, LogLevel, type HubConnection } from "@microsoft/signalr";
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
import { type Action } from "../util";
import { useScheduleHubConnection } from "../zustand/zustand";

export interface ScheduleClient {
	ReceiveInitialSchedules: Action<[Schedule[]]>;
	UpdateSchedule: Action<[ScheduleId, Schedule]>;
	RemoveSchedule: Action<[ScheduleId]>;

	ReceiveInitialClassrooms: Action<[Classroom[]]>;
	UpdateClassroom: Action<[Classroom]>;
}

export interface ScheduleHub {
	RegisterForSlot: (
		slotId: ExamSlotId,
	) => Promise<Result<boolean>> | undefined;

	CreateSwapRequest: (
		scheduleId: ScheduleId,
		examSlotId: ExamSlotId,
	) => Promise<Result<boolean>> | undefined;
	AcceptSwapRequest: (
		swaprequestId: SwapRequestId,
	) => Promise<Result<boolean>> | undefined;
	DeleteSwapRequest: (
		swaprequestId: SwapRequestId,
	) => Promise<Result<boolean>> | undefined;

	CreateSchedule: (
		request: ScheduleCreateRequest,
	) => Promise<Result<boolean>> | undefined;
	ReportStudents: (
		slotId: ExamSlotId,
		actualParticipants: UserProfileId[],
	) => Promise<Result<boolean>> | undefined;
}

export function useSignalRInit(hubUrl: string = endpoints.scheduleHub) {
	const { data: connection, setData: setConnection } =
		useScheduleHubConnection();
	const handlersRef = useRef<ScheduleClient>(undefined);
	const connectionRef = useRef<HubConnection>(undefined);

	const init = useCallback(
		async (handlers: ScheduleClient) => {
			let conn = connection;

			if (!connection) {
				connectionRef.current = createConnection(hubUrl);
				await connectionRef.current.start();
				conn = {
					AcceptSwapRequest(swaprequestId) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"AcceptSwapRequest",
							swaprequestId,
						);
					},
					CreateSchedule(request) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"CreateSchedule",
							request,
						);
					},
					CreateSwapRequest(scheduleId, userId) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"CreateSwapRequest",
							scheduleId,
							userId,
						);
					},
					DeleteSwapRequest(swaprequestId) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"DeleteSwapRequest",
							swaprequestId,
						);
					},
					RegisterForSlot(slotId) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"RegisterForSlot",
							slotId,
						);
					},
					ReportStudents(slotId, actualParticipants) {
						return connectionRef.current?.invoke<Result<boolean>>(
							"ReportStudents",
							slotId,
							actualParticipants,
						);
					},
				};

				setConnection(conn);
			}

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
		},
		[hubUrl, connection, setConnection],
	);

	const rejoin = () => {
		connectionRef.current?.start();
	};

	useEffect(() => {
		return () => {
			if (!connection || !handlersRef.current) return;
			Object.entries(handlersRef.current).forEach(
				([eventName, handler]) => {
					connectionRef.current?.off(eventName, handler);
				},
			);
			handlersRef.current = undefined;
		};
	}, [connection]);

	return { init, rejoin };
}

export function createConnection(hubUrl: string) {
	return new HubConnectionBuilder()
		.withUrl(hubUrl, {
			withCredentials: true,
		})
		.configureLogging(LogLevel.Debug)
		.withAutomaticReconnect()
		.build();
}
