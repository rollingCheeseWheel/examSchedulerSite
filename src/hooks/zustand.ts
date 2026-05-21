import { create } from "zustand";
import type { Classroom, ClassroomId } from "../models/classroom";
import type { Schedule, ScheduleId } from "../models/schedule";
import type { UserProfile } from "../models/user";
import {
	examSlotSorter,
	swapRequestSorter,
	userProfileSorter,
	type Action,
	type Func,
} from "../util";
import type { ScheduleHub } from "./useSignalR";

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

interface MapStore<K, V> {
	asMap: Map<K, V>;
	asArray: V[];
	hasChanged: boolean;
	keySelector: Func<[V], K>;
	set: Action<V[]>;
	get: Func<[K], V | undefined>;
	reset: Action<[]>;
	clear: Action<[]>;
	removeKey: Action<[K]>;
	remove: Action<[V]>;
}

function createMapStore<K, V>(
	keySelector: Func<[V], K>,
	postProcessor?: Func<[V], V>,
	initialState: Map<K, V> = new Map(),
) {
	function process(data: V) {
		return (postProcessor ?? ((x) => x))(data);
	}

	return create<MapStore<K, V>>((set, get) => ({
		asMap: new Map(initialState),
		asArray: Array.from(initialState.values()),
		hasChanged: false,
		keySelector,
		set(...data) {
			const temp = new Map(get().asMap);
			for (const instance of data) {
				temp.set(keySelector(instance), process(instance));
			}
			set({
				asMap: temp,
				asArray: Array.from(temp.values()),
				hasChanged: true,
			});
		},
		get(key) {
			return get().asMap.get(key);
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
		removeKey(key) {
			var temp = new Map(get().asMap);
			temp.delete(key);
			set({
				hasChanged: true,
				asMap: temp,
				asArray: Array.from(temp.values()),
			});
		},
		remove(value) {
			var key = keySelector(value);
			get().removeKey(key);
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

export const useUserProfile = createSingletonStore<UserProfile>();
export const useIsTeacher = () =>
	useUserProfile((s) => s.data)?.role === "teacher";

export const useHubConnection = createSingletonStore<ScheduleHub>();
export const useLoginError = createSingletonStore<string[]>();
