import { create } from "zustand";
import type { ScheduleHub } from "../hooks/useSignalR";
import type { Classroom } from "../models/classroom";
import type { Schedule } from "../models/schedule";
import type { UserProfile } from "../models/user";
import {
	classroomSorter,
	examSlotSorter,
	scheduleSorter,
	swapRequestSorter,
	userProfileSorter,
	type Action,
	type Func,
} from "../util";

export interface DisclosureStore {
	state: boolean;
	hasChanged: boolean;
	open: Action<[]>;
	close: Action<[]>;
	setState: Action<[boolean]>;
	toggle: Action<[]>;
	reset: Action<[]>;
}

export function createDisclosureStore(initialState: boolean = false) {
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

export interface ListStore<T> {
	data: T[];
	hasChanged: boolean;
	setData: Action<[T[]]>;
	append: Action<T[]>;
	reset: Action<[]>;
	clear: Action<[]>;
}

export function createListStore<T>(
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

export interface SingletonStore<T> {
	data?: T;
	hasChanged: boolean;
	setData: Action<[T?]>;
	reset: Action<[]>;
	clear: Action<[]>;
}

export function createSingletonStore<T>(
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

export const useClassrooms = createListStore<Classroom>(classroomSorter);
export const useSchedules = createListStore<Schedule>(
	scheduleSorter,
	(schedule) => ({
		...schedule,
		examSlots: schedule.examSlots.sort(examSlotSorter).map((slot) => ({
			...slot,
			participants: slot.participants.sort(userProfileSorter),
		})),
		swapRequests: schedule.swapRequests.sort(swapRequestSorter),
	}),
);

export const useUserProfile = createSingletonStore<UserProfile>();
export const useIsTeacher = () =>
	useUserProfile((s) => s.data)?.role === "teacher";

export const useCrossSiteError = createSingletonStore<string>();
export const useScheduleHubConnection = createSingletonStore<ScheduleHub>();
