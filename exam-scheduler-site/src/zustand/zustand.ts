import { create } from "zustand";
import type { LinkGroupProp } from "../components/navbar-link-group/LinkGroup";
import type { Schedule } from "../models/schedule";
import type { UserProfile } from "../models/user";
import type { Calendar } from "../models/calendar";

interface DisclosureStore {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	setState: (state: boolean) => void;
	toggle: () => void;
	reset: () => void;
}

function createDisclosureStore(initialState: boolean = false) {
	return create<DisclosureStore>((set) => ({
		isOpen: initialState,
		open() {
			set(() => ({ isOpen: true }));
		},
		close() {
			set(() => ({ isOpen: false }));
		},
		setState(state) {
			set(() => ({ isOpen: state }));
		},
		toggle() {
			set((state) => ({ isOpen: !state.isOpen }));
		},
		reset() {
			set(() => ({ isOpen: initialState }));
		},
	}));
}

interface ListStore<T> {
	data: T[];
	setData: (data: T[]) => void;
	append: (...data: T[]) => void;
	reset: () => void;
	clear: () => void;
}

function createListStore<T>(initialState: T[] = []) {
	return create<ListStore<T>>((set) => ({
		data: initialState,
		setData(data) {
			set(() => ({ data: data }));
		},
		append(...data) {
			set((state) => ({ data: state.data.concat(data) }));
		},
		reset() {
			set(() => ({ data: initialState }));
		},
		clear() {
			set(() => ({ data: [] }));
		},
	}));
}

interface SingletonStore<T> {
	data?: T;
	setData: (data: T) => void;
	reset: () => void;
	clear: () => void;
}

function createSingletonStore<T>(initialState?: T) {
	return create<SingletonStore<T>>((set) => ({
		data: initialState,
		setData(data) {
			set(() => ({ data: data }));
		},
		clear() {
			set(() => ({ data: undefined }));
		},
		reset() {
			set(() => ({ data: initialState }));
		},
	}));
}

export const useLoadingOverlay = createDisclosureStore();
export const useNavbarState = createDisclosureStore();

export const useNavbarMenu = createListStore<LinkGroupProp>();
export const useSchedules = createListStore<Schedule>();

export const useUserProfile = createSingletonStore<UserProfile>();
export const useCalendar = createSingletonStore<Calendar>();