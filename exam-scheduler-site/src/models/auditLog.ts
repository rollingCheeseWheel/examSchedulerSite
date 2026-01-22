import type { Guid } from "./brand";
import type { AuditLogActor } from "./enums";

export interface AuditLog {
	timestamp: Date;
	actorId: Guid;
	actorType: AuditLogActor;
	actorName?: string;
	action: string;
	description?: string;
}
