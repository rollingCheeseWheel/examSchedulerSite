import type { Guid } from "./brand";
import type { AuditLogActor } from "./enums";

export interface AuditLog {
	timestamp: Date;
	action: string;
	actorId: Guid;
	actorType: AuditLogActor;
	actorName?: string;
	description?: string;
}
