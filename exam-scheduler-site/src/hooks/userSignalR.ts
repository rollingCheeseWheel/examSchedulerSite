import { useCallback, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useSignalRConnection } from "../zustand/zustand";
import { endpoints } from "../endpoints";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handlers = Record<string, (...args: any[]) => void>;

export function useSignalRInit(hubUrl: string = endpoints.scheduleHub) {
	const { instance: connection, setData: setConnection } =
		useSignalRConnection();
	const handlersRef = useRef<Handlers>({});

	const init = useCallback(
		async (handlers: Handlers) => {
			let conn = connection;

			if (!connection) {
				conn = createConnection(hubUrl);
				await conn.start();
				setConnection(conn);
			}

			Object.entries(handlersRef.current).forEach(
				([eventName, handler]) => {
					conn?.off(eventName, handler);
				},
			);

			Object.entries(handlers).forEach(([eventName, handler]) => {
				conn?.on(eventName, handler);
			});

			handlersRef.current = handlers;
		},
		[hubUrl, connection, setConnection],
	);

	useEffect(() => {
		return () => {
			if (!connection) return;
			Object.entries(handlersRef.current).forEach(
				([eventName, handler]) => {
					connection.off(eventName, handler);
				},
			);
			handlersRef.current = {};
		};
	}, [connection]);

	return init;
}

export function createConnection(hubUrl: string) {
	return new HubConnectionBuilder()
		.withUrl(hubUrl, {
			withCredentials: true,
		})
		.withAutomaticReconnect()
		.build();
}
