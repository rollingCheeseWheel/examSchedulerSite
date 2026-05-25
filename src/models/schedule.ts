import type { AuditLog } from "./auditLog";
import type {
	Brand,
	BrandedId,
	BrandedString,
	DateOnlyString,
	DateString,
} from "./brand";
import type { DayOfWeek, Subject, TeacherWithSubjects } from "./calendar";
import type { ClassroomId } from "./classroom";
import type { AutoLockIn, SlotLockState } from "./enums";
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
	classroomId: ClassroomId;
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
	classroomId: ClassroomId;
	subjectName: string;
	description?: string;
	startDate: DateOnlyString;
	lockInOffset: TimeSpan;
	generator: ScheduleGenerator;
}

export interface ScheduleGenerator {
	slots: ScheduleGeneratorSlot[];
	blacklistedDays: DateString[];
}

export interface ScheduleGeneratorSlot {
	dayOfWeek: DayOfWeek;
	maxParticipants: Maximum;
}
