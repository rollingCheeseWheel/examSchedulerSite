import type { BrandedString, DateString, Guid } from "./brand";
import type { AuditLogActor, AuditLogTarget } from "./enums";

export type ActionName = BrandedString<"action">;
export type ActorName = BrandedString<"actorname">;
export type AuditLogDescription = BrandedString<"auditlogdescription">;

export interface AuditLog {
	timestamp: DateString;
	action: ActionName;
	originType: AuditLogActor;
	origindId: Guid;
	originName?: ActorName;
	targetType?: AuditLogTarget;
	targetId?: Guid;
	targetName?: ActorName;
	description?: AuditLogDescription;
}
