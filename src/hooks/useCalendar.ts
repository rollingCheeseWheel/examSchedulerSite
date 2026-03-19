import { useCallback } from "react";
import { api } from "../main";
import type { Lesson } from "../models/calendar";
import type { ClassroomId } from "../models/classroom";
import type { Result } from "../models/result";

export function useCalendar() {
	const fetchWeek = useCallback(
		async (classroomId?: ClassroomId, date?: Date, signal?: AbortSignal) => {
			if (!date || !classroomId) {
				return [];
			}

			const res = await api.get<Result<Lesson[]>>(
				`api/calendar/${classroomId}/${date.getTime()}`,
				{ signal },
			);

			return res.data.data ?? [];
		},
		[],
	);

	return fetchWeek;
}
