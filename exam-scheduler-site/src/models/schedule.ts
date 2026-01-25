import type { AuditLog } from "./auditLog";
import type { Brand, BrandedId } from "./brand";
import type { ClassroomId } from "./classroom";
import type { AutoLockIn, SlotFillingBehaviour } from "./enums";
import type { SwapRequest } from "./swapRequest";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ExamSlotId = BrandedId<"examslot">;

export type TimeSpan = Brand<Date, "timespan">;

export interface Schedule {
	id: ScheduleId;
	startDate: Date;
	endDate: Date;
	autoLockIn: AutoLockIn;
	lockInOffset: TimeSpan;
	subjectName: string;
	examSlots: ExamSlot[];
	auditLogs: AuditLog[];
	swapRequests: SwapRequest[];
	description?: string;
}

export interface ExamSlot {
	id: ExamSlotId;
	date: Date;
	participants: UserProfile[];
	actuallyParticipated: UserProfile[];
	maxParticipants: number;
	minParticipants: number;
}

export interface ScheduleCreateRequest {
	subjectName: string;
	classroomId: ClassroomId;
	slotFillingBehaviour: SlotFillingBehaviour;
	startDate: Date;
	endDate: Date;
	autoLockIn: AutoLockIn;
	lockInOffset: TimeSpan;
	generatorSlots: ScheduleGeneratorSlot[];
	description?: string;
}

export interface ScheduleGeneratorSlot {
	offset: TimeSpan;
	minParticipants: number;
	maxParticipants: number;
}
