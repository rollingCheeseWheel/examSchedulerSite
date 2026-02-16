import type { AuditLog } from "./auditLog";
import type { Brand, BrandedId } from "./brand";
import type { Subject, Teacher } from "./calendar";
import type { ClassroomId } from "./classroom";
import type { AutoLockIn, SlotFillingBehaviour } from "./enums";
import type { SwapRequest } from "./swapRequest";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ExamSlotId = BrandedId<"examslot">;

export type StartDate = Brand<Date, "start">;
export type EndDate = Brand<Date, "end">;
export type TimeSpan = Brand<Date, "timespan">;

export type Mininum = Brand<number, "min">;
export type Maximum = Brand<number, "max">;

export interface Schedule {
	id: ScheduleId;
	startDate: StartDate;
	endDate: EndDate;
	autoLockIn: AutoLockIn;
	lockInOffset: TimeSpan;
	description?: string;
	subject: Subject;
	teachers: Teacher[];
	examSlots: ExamSlot[];
	auditLogs: AuditLog[];
	swapRequests: SwapRequest[];
}

export interface ExamSlot {
	id: ExamSlotId;
	date: Date;
	participants: UserProfile[];
	maxParticipants: Mininum;
	minParticipants: Mininum;
	isLocked: boolean;
}

export interface ScheduleCreateRequest {
	subjectName: string;
	classroomId: ClassroomId;
	slotFillingBehaviour: SlotFillingBehaviour;
	startDate: StartDate;
	endDate: EndDate;
	autoLockIn: AutoLockIn;
	lockInOffset: TimeSpan;
	generatorSlots: ScheduleGeneratorSlot[];
	description?: string;
}

export interface ScheduleGeneratorSlot {
	offset: TimeSpan;
	minParticipants: Mininum;
	maxParticipants: Maximum;
}
