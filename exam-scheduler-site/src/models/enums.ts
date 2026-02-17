export type UserRole = "student" | "teacher";
export type AutoLockIn = "fixedDate" | "timeBeforeExamination";
export type SlotFillingBehaviour = "randomizeUnassigned";
export type AuditLogActor = "student" | "teacher" | "system"
export type AuditLogTarget = "student" | "schedule" | "examslot" | "swaprequest"
export type SlotLockState = "open" | "locked" | "definite"