import type { BrandedString, Guid } from "./brand";
import type { AuditLogActor } from "./enums";

export type ActionName = BrandedString<"action">;
export type ActorName = BrandedString<"actorname">;
export type AuditLogDescription = BrandedString<"auditlogdescription">;

export interface AuditLog {
	timestamp: Date;
	action: ActionName;
	actorType: AuditLogActor;
	firstActorId: Guid;
	secondActorId: Guid;
	firstActorName?: ActorName;
	secondActorName?: ActorName;
	description?: AuditLogDescription;
}
