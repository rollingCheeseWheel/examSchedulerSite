import type { AuditLog } from "./auditLog";
import type { Brand, BrandedId, BrandedString, DateString } from "./brand";
import type { DayOfWeek, Subject, TeacherWithSubjects } from "./calendar";
import type { ClassroomId } from "./classroom";
import type { AutoLockIn, SlotFillingBehaviour, SlotLockState } from "./enums";
import type { SwapRequest } from "./swapRequest";
import type { UserProfile } from "./user";

export type ScheduleId = BrandedId<"schedule">;
export type ExamSlotId = BrandedId<"examslot">;

export type StartDate = Brand<Date, "start">;
export type EndDate = Brand<Date, "end">;
export type TimeSpanString = BrandedString<"timespan">;
export type TimeSpan = Brand<Date, "timespan">;

export type Mininum = Brand<number, "min">;
export type Maximum = Brand<number, "max">;

export interface Schedule {
	id: ScheduleId;
	startDate: DateString;
	endDate: DateString;
	autoLockIn: AutoLockIn;
	lockInOffset: TimeSpanString;
	description?: string;
	subject: Subject;
	teachers: TeacherWithSubjects[];
	examSlots: ExamSlot[];
	auditLogs: AuditLog[];
	swapRequests: SwapRequest[];
}

export interface ExamSlot {
	id: ExamSlotId;
	date: DateString;
	participants: UserProfile[];
	maxParticipants: Maximum;
	minParticipants?: Mininum;
	lockState: SlotLockState;
}

export interface ScheduleCreateRequest {
	subjectName: string;
	classroomId: ClassroomId;
	startDate: Date;
	lockInOffset: TimeSpan;
	generatorSlots: ScheduleGeneratorSlot[];
	description?: string;
}

export interface ScheduleGeneratorSlot {
	offset: DayOfWeek;
	maxParticipants: Maximum;
}
