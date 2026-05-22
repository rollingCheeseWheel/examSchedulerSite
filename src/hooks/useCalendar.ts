import { useCallback } from "react";
import { api } from "../main";
import type { Lesson } from "../models/calendar";
import type { ClassroomId } from "../models/classroom";
import type { Result } from "../models/result";

export function useCalendar() {
	const fetchWeek = useCallback(
		async (classroomId?: ClassroomId, date?: Date, signal?: AbortSignal) => {
			if (!date || !classroomId) {
				return;
			}

			return (
				await api<Result<Lesson[]>>(
					`api/calendar/${classroomId}/${date.getTime()}`,
					{ signal, method: "GET" },
				)
			).data;
		},
		[],
	);

	return fetchWeek;
}
