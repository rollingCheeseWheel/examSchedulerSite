import type { AuditLogActor } from "./enums";

export interface AuditLog {
	timestamp: Date;
	actor: string;
	actorType: AuditLogActor;
	actorName?: string;
	action: string;
	description?: string;
}
