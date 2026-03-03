import { useCallback, useEffect, useRef } from "react";
import type { Lesson, Week } from "../models/calendar";
import { weekSorter, lessonSorter } from "../util";
import { createListStore } from "../zustand/zustand";
import type { ClassroomId } from "../models/classroom";
import { usePromise } from "./usePromise";
import type { Result } from "../models/result";
import { api } from "../main";

const useCalendarWeeks = createListStore<Week>(weekSorter, (week) => ({
	...week,
	lessons: week.lessons.sort(lessonSorter),
}));

export function useCalendar() {
	const { data, resolve } = usePromise<Result<Lesson[]>>();
	const dateRef = useRef<{ date?: Date; fetchId: number }>({ fetchId: 0 });

	const {calendar}

	useEffect(() => {
		if (data) {
			usecale;
		}
	}, [data]);

	const getWeek = useCallback((classroomId: ClassroomId, date: Date) => {
		resolve(api.get(`api/calendar/${classroomId}/${date.getTime()}`));
	}, []);

	return { getWeek };
}
