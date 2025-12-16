import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";
import type { StudentProfile } from "./user";

export interface Schedule {
    id: string;
    autoLockIn: number | AutoLockIn;
    firstExamination: string;
    lockInOffset: string;
    description: string;
    subject: Subject;
    examSlots: ScheduleSlot[];
}

export interface ScheduleSlot {
    id: string;
    date: string;
    participants: StudentProfile[];
    actuallyParticipated: StudentProfile[];
    maxParticipants: number;
    minParticipants: number;
}