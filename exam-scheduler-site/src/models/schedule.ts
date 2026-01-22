import type { BrandedId } from "./brand";
import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ExamSlotId = BrandedId<"examslot">;

export interface Schedule {
	id: ScheduleId;
	autoLockIn: AutoLockIn;
	firstExamination: Date;
	lockInOffset: Date;
	description: string;
	subject: Subject;
	examSlots: ExamSlot[];
}

export interface ExamSlot {
	id: ExamSlotId;
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
