import { create } from "zustand";
import type { LinkGroupProp } from "../components/navbar-link-group/LinkGroup";
import type { Schedule } from "../models/schedule";
import type { UserProfile } from "../models/user";
import type { Classroom } from "../models/classroom";
import { HubConnection } from "@microsoft/signalr";
import type { ScheduleHub } from "../hooks/userSignalR";

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
	setData: (data: T[]) => void;
	append: (...data: T[]) => void;
	reset: () => void;
	clear: () => void;
}

function createListStore<T>(initialState: T[] = []) {
	return create<ListStore<T>>((set) => ({
		data: initialState,
		hasChanged: false,
		setData(data) {
			set(() => ({ data: data, hasChanged: true }));
		},
		append(...data) {
			set((state) => ({
				data: state.data.concat(data),
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
	instance?: T;
	hasChanged: boolean;
	setData: (data?: T) => void;
	reset: () => void;
	clear: () => void;
}

function createSingletonStore<T>(initialInstance?: T) {
	return create<SingletonStore<T>>((set) => ({
		instance: initialInstance,
		hasChanged: false,
		setData(data) {
			set(() => ({ instance: data, hasChanged: true }));
		},
		clear() {
			set(() => ({ instance: undefined, hasChanged: true }));
		},
		reset() {
			set(() => ({ instance: initialInstance, hasChanged: true }));
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