import { useCallback, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useScheduleHubConnection } from "../zustand/zustand";
import { endpoints } from "../endpoints";
import type {
	ExamSlotId,
	Schedule,
	ScheduleCreateRequest,
	ScheduleId,
} from "../models/schedule";
import type { Result } from "../models/result";
import type { UserProfile, UserProfileId } from "../models/user";
import type { SwapRequestId } from "../models/swapRequest";

export interface ScheduleClient {
	ReceiveInitial: (schedules: Schedule[]) => void;
	UpdateSchedule: (scheduleId: ScheduleId, schedule: Schedule) => void;
}

export interface ScheduleHub {
	RegisterForSlot: (
		slotId: ExamSlotId,
	) => Promise<Result<boolean>> | undefined;

	CreateSwapRequest: (
		scheduleId: ScheduleId,
		userId: UserProfileId,
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
		actualParticipants: UserProfile[],
	) => Promise<Result<boolean>> | undefined;
}

export function useSignalRInit(hubUrl: string = endpoints.scheduleHub) {
	const { instance: connection, setData: setConnection } =
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
						return connectionRef.current?.invoke(
							"AcceptSwapRequest",
							swaprequestId,
						);
					},
					CreateSchedule(request) {
						return connectionRef.current?.invoke(
							"CreateSchedule",
							request,
						);
					},
					CreateSwapRequest(scheduleId, userId) {
						return connectionRef.current?.invoke(
							"CreateSwapRequest",
							scheduleId,
							userId,
						);
					},
					DeleteSwapRequest(swaprequestId) {
						return connectionRef.current?.invoke(
							"DeleteSwapRequest",
							swaprequestId,
						);
					},
					RegisterForSlot(slotId) {
						return connectionRef.current?.invoke(
							"RegisterForSlot",
							slotId,
						);
					},
					ReportStudents(slotId, actualParticipants) {
						return connectionRef.current?.invoke(
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
        connectionRef.current?.start()
    }

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

	return {init,rejoin};
}

export function createConnection(hubUrl: string) {
	return new HubConnectionBuilder()
		.withUrl(hubUrl, {
			withCredentials: true,
		})
		.withAutomaticReconnect()
		.build();
}
