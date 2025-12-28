import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";
import type { UserProfile } from "./user";

export interface Schedule {
    id: string;
    autoLockIn: AutoLockIn;
    firstExamination: string;
    lockInOffset: string;
    description: string;
    subject: Subject;
    selectedSlotId: string;
    examSlots: ScheduleSlot[];
}

export interface ScheduleSlot {
    id: string;
    date: string;
    participants: UserProfile[];
    actuallyParticipated: UserProfile[];
    maxParticipants: number;
    minParticipants: number;
}