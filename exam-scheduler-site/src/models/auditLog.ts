import type { Guid } from "./brand";
import type { AuditLogActor } from "./enums";

export interface AuditLog {
	timestamp: Date;
	action: string;
	actorType: AuditLogActor;
	firstActorId: Guid;
	secondActorId: Guid;
	firstActorName?: string;
	secondActorName?: string;
	description?: string;
}
