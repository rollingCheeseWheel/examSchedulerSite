import { create } from "zustand";
import type { LinkGroupProp } from "../components/common/navbar-link-group/LinkGroup";
import type { ScheduleHub } from "../hooks/useSignalR";
import type { Classroom } from "../models/classroom";
import type { Schedule } from "../models/schedule";
import type { UserProfile } from "../models/user";
import type { Action } from "../util";

interface DisclosureStore {
	state: boolean;
	hasChanged: boolean;
	open: () => void;
	close: () => void;
	setState: (state: boolean) => void;
	toggle: () => void;
	reset: () => void;
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

function createListStore<T>(initialState: T[] = []) {
	return create<ListStore<T>>((set) => ({
		data: initialState,
		hasChanged: false,
		setData(data) {
			set(() => ({ data: data, hasChanged: true }));
		},
		append(...data) {
			set((prev) => ({
				data: prev.data.concat(data),
				hasChanged: true,
			}));
		},
		reset() {
			set(() => ({ data: initialState, hasChanged: true }));
		},
		clear() {
			set(() => ({ data: [], hasChanged: true }));
		},
	}));
}

interface SingletonStore<T> {
	data?: T;
	hasChanged: boolean;
	setData: (data?: T) => void;
	reset: () => void;
	clear: () => void;
}

function createSingletonStore<T>(initialInstance?: T) {
	return create<SingletonStore<T>>((set) => ({
		data: initialInstance,
		hasChanged: false,
		setData(data) {
			set(() => ({ data: data, hasChanged: true }));
		},
		clear() {
			set(() => ({ data: undefined, hasChanged: true }));
		},
		reset() {
			set(() => ({ data: initialInstance, hasChanged: true }));
		},
	}));
}

export const useLoadingOverlay = createDisclosureStore();
export const useNavbarState = createDisclosureStore();

export const useNavbarMenu = createListStore<LinkGroupProp>();
export const useSchedules = createListStore<Schedule>();
export const useClassrooms = createListStore<Classroom>();

export const useUserProfile = createSingletonStore<UserProfile>();
export const useCrossSiteError = createSingletonStore<string>();
export const useScheduleHubConnection = createSingletonStore<ScheduleHub>();
