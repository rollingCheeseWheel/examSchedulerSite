import { create } from "zustand";
import type { LinkGroupProp } from "../components/common/navbar-link-group/LinkGroup";
import type { ScheduleHub } from "../hooks/useSignalR";
import type { Classroom } from "../models/classroom";
import type { Schedule } from "../models/schedule";
import type { UserProfile } from "../models/user";
import type { Action, Func } from "../util";

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
export const useNavbarState = createDisclosureStore();

export const useNavbarLinks = createListStore<LinkGroupProp>();
export const useSchedules = createListStore<Schedule>(
	(a, b) => a.startDate.getTime() - b.startDate.getTime(),
	(x) => ({
		...x,
		examSlots: x.examSlots
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.map((s) => ({
				...s,
				participants: s.participants.sort((a, b) =>
					a.name.localeCompare(b.name),
				),
			})),
	}),
);
export const useClassrooms = createListStore<Classroom>((a, b) =>
	a.name.localeCompare(b.name),
);

export const useUserProfile = createSingletonStore<UserProfile>();
export function useIsTeacher() {
	return useUserProfile((s) => s.data)?.role === "teacher";
}

export const useCrossSiteError = createSingletonStore<string>();
export const useScheduleHubConnection = createSingletonStore<ScheduleHub>();
