import { create } from "zustand";
import type { ScheduleHub } from "./hooks/useSignalR";
import type { SubjectName, Lesson } from "./models/calendar";
import type { Classroom, ClassroomId } from "./models/classroom";
import type { Schedule, ScheduleId } from "./models/schedule";
import type { Username, UserProfile } from "./models/user";
import {
	equals,
	examSlotSorter,
	lessonSorter,
	swapRequestSorter,
	userProfileSorter,
	type Action,
	type Func,
} from "./util";

interface DisclosureStore {
	state: boolean;
	hasChanged: boolean;
	open: Action<[]>;
	close: Action<[]>;
	setState: Action<[boolean]>;
	toggle: Action<[]>;
	reset: Action<[]>;
}

function createDisclosureStore(initialState: boolean = false) {
	return create<DisclosureStore>((set) => ({
		state: initialState,
		hasChanged: false,
		open() {
			set(() => ({ state: true, hasChanged: true }));
		},
		close() {
			set(() => ({ state: false, hasChanged: true }));
		},
		setState(state) {
			set(() => ({ state: state, hasChanged: true }));
		},
		toggle() {
			set((state) => ({ state: !state.state, hasChanged: true }));
		},
		reset() {
			set(() => ({ state: initialState, hasChanged: true }));
		},
	}));
}

interface ListStore<T> {
	data: T[];
	hasChanged: boolean;
	setData: Action<[T[]]>;
	append: Action<T[]>;
	reset: Action<[]>;
	clear: Action<[]>;
}

function createListStore<T>(
	sortFunction?: Func<[T, T], number>,
	postProcessor?: Func<[T], T>,
	initialState: T[] = [],
) {
	function sortData(data: T[]) {
		return sortFunction ? data.sort(sortFunction) : data;
	}

	function process(data: T[]) {
		return data.map(postProcessor ?? ((x) => x));
	}

	return create<ListStore<T>>((set) => ({
		data: initialState,
		hasChanged: false,
		setData(data) {
			set(() => ({ data: process(sortData(data)), hasChanged: true }));
		},
		append(...data) {
			set((prev) => ({
				data: process(sortData(prev.data.concat(data))),
				hasChanged: true,
			}));
		},
		reset() {
			set(() => ({
				data: process(sortData(initialState)),
				hasChanged: true,
			}));
		},
		clear() {
			set(() => ({ data: [], hasChanged: true }));
		},
	}));
}

interface MapStore<K, V> {
	asArray: V[];
	asMap: Map<K, V>;
	hasChanged: boolean;
	set: Action<V[]>;
	get: Func<[K], V | undefined>;
	reset: Action<[]>;
	clear: Action<[]>;
}

function createMapStore<K, V>(
	keySelector: Func<[V], K>,
	postProcessor?: Func<[V], V>,
	initialState: Map<K, V> = new Map(),
) {
	function process(data: V) {
		return (postProcessor ?? ((x) => x))(data);
	}

	return create<MapStore<K, V>>((set) => ({
		asMap: new Map(initialState),
		asArray: [],
		hasChanged: false,
		set(...data) {
			set((prev) => {
				const temp = new Map(prev.asMap);
				for (const instance of data) {
					temp.set(keySelector(instance), process(instance));
				}
				return {
					asMap: temp,
					asArray: Array.from(this.asMap.values()),
					hasChanged: true,
				};
			});
		},
		get(key) {
			return this.asMap.get(key);
		},

		clear() {
			set({
				hasChanged: true,
				asMap: initialState,
				asArray: Array.from(initialState.values()),
			});
		},
		reset() {
			set({ hasChanged: true, asMap: new Map(), asArray: [] });
		},
	}));
}

interface SingletonStore<T> {
	data?: T;
	hasChanged: boolean;
	setData: Action<[T?]>;
	reset: Action<[]>;
	clear: Action<[]>;
}

function createSingletonStore<T>(
	postProcessor?: Func<[T | undefined], T | undefined>,
	initialInstance?: T,
) {
	function process(data?: T) {
		return postProcessor ? postProcessor(data) : data;
	}

	return create<SingletonStore<T>>((set) => ({
		data: initialInstance,
		hasChanged: false,
		setData(data) {
			set(() => ({ data: process(data), hasChanged: true }));
		},
		clear() {
			set(() => ({ data: undefined, hasChanged: true }));
		},
		reset() {
			set(() => ({ data: process(initialInstance), hasChanged: true }));
		},
	}));
}

export const useLoadingOverlay = createDisclosureStore();

export const useClassrooms = createMapStore<ClassroomId, Classroom>(
	(c) => c.id,
);
export const useSchedules = createMapStore<ScheduleId, Schedule>(
	(s) => s.id,
	(schedule) => ({
		...schedule,
		examSlots: schedule.examSlots.sort(examSlotSorter).map((slot) => ({
			...slot,
			participants: slot.participants.sort(userProfileSorter),
		})),
		swapRequests: schedule.swapRequests.sort(swapRequestSorter),
	}),
);
export const useLessonWeeks = createMapStore<number, Lesson[]>((l) =>
	new Date(l.sort(lessonSorter).at(0)?.date ?? 0).getTime(),
);

export const useUserProfile = createSingletonStore<UserProfile>();
export const useIsTeacher = () =>
	useUserProfile((s) => s.data)?.role === "teacher";
export function useTeacherSubjects() {
	const userProfile = useUserProfile((s) => s.data);
	const lessons = useLessonWeeks((s) => s.asArray).flat();

	const res = new Set<SubjectName>();
	if (userProfile) {
		for (const lesson of lessons) {
			if (
				lesson.teachers.some(
					equals((t) => t.name as Username, userProfile.name),
				)
			) {
				res.add(lesson.subject.name);
			}
		}
	}
	return Array.from(res.values());
}

export const useCrossSiteError = createSingletonStore<string>();
export const useScheduleHubConnection = createSingletonStore<ScheduleHub>();
