import type { AuditLogActor } from "./enums";

export interface AuditLog {
    timestamp: string;
    actor: string;
    actorType: number | AuditLogActor;
    actorName: string?;
    action: string;
    description: string?;
}