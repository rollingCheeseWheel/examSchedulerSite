import type { TimeSpan } from "../util";
import type { AuditLog } from "./auditLog";
import type { BrandedId } from "./brand";
import type { Subject, Teacher } from "./calendar";
import type { ClassroomId } from "./classroom";
import type { AutoLockIn, SlotFillingBehaviour } from "./enums";
import type { SwapRequest } from "./swapRequest";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ExamSlotId = BrandedId<"examslot">;

export interface Schedule {
	id: ScheduleId;
	startDate: Date;
	endDate: Date;
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
	maxParticipants: number;
	minParticipants: number;
	isLocked: boolean;
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
