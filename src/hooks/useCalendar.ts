import { useCallback } from "react";
import { api } from "../main";
import type { Lesson } from "../models/calendar";
import type { ClassroomId } from "../models/classroom";
import type { Result } from "../models/result";
import { useLessonWeeks } from "../zustand";

export function useCalendar() {
	const setLessons = useLessonWeeks((s) => s.set);

	const fetchWeek = useCallback(
		async (classroomId?: ClassroomId, date?: Date, signal?: AbortSignal) => {
			if (!date || !classroomId) {
				return;
			}

			const res = await api.get<Result<Lesson[]>>(
				`api/calendar/${classroomId}/${date.getTime()}`,
				{ signal },
			);

			setLessons(res.data.data ?? []);
		},
		[setLessons],
	);

	return fetchWeek;
}
