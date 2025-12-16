import type { Subject } from "./calendar";
import type { AutoLockIn } from "./enums";

export interface Schedule {
    id: string;
    autoLockIn: number | AutoLockIn;
    firstExamination: string;
    lockInOffset: string;
    description: string;
    subject: Subject;
    examSlots: ExamSlot[];
}

export interface ExamSlot {
    id: string;
    date: string;
    participants: StudentProfile[];
    actuallyParticipated: StudentProfile[];
    maxParticipants: number;
    minParticipants: number;
}