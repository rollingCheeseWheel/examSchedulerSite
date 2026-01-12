import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";
import type { UserProfile } from "./user";

export interface Schedule {
	id: string;
	autoLockIn: AutoLockIn;
	firstExamination: Date;
	lockInOffset: Date;
	description: string;
	subject: Subject;
	selectedSlotId: string;
	examSlots: ScheduleSlot[];
}

export interface ScheduleSlot {
	id: string;
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
	id: string;
	scheduleId: string;
	requestingStudentId: string;
	requestedStudentId: string;
	expirationDate: Date;
}
