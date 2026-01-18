import type { BrandedId } from "./brand";
import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ScheduleSlotId = BrandedId<"schedule.slot">;
export type SwapRequestId = BrandedId<"swaprequest">;

export interface Schedule {
	id: ScheduleId;
	autoLockIn: AutoLockIn;
	firstExamination: Date;
	lockInOffset: Date;
	description: string;
	subject: Subject;
	selectedSlotId: ScheduleSlotId;
	examSlots: ScheduleSlot[];
}

export interface ScheduleSlot {
	id: ScheduleSlotId;
	date: Date;
	participants: UserProfile[];
	actuallyParticipated: UserProfile[];
	maxParticipants: number;
	minParticipants: number;
}

export interface ScheduleGeneratorSlot {
	offset: number;
	minParticipants: number;
	maxParticipants: number;
}

export interface SwapRequest {
	id: SwapRequestId;
	scheduleId: string;
	requestingStudentId: string;
	requestedStudentId: string;
	expirationDate: Date;
}
