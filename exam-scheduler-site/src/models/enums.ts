export const AuditLogActor = {
	Student: 0,
	Teacher: 1,
	Admin: 2,
	System: 3,
};
export type AuditLogActor = (typeof AuditLogActor)[keyof typeof AuditLogActor];

export const AutoLockIn = {
	FixedDate: 0,
	TimeBeforeExamination: 1,
};
export type AutoLockIn = (typeof AutoLockIn)[keyof typeof AutoLockIn];

export const UserRole = {
	Student: 0,
	Teacher: 1,
	Admin: 2,
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SlotFillingBehaviour = {
	RandomizeUnassigned: 0,
	RandomizeUnassignedThenCompact: 1,
	CompactAll: 2,
};
export type SlotFillingBehaviour =
	(typeof SlotFillingBehaviour)[keyof typeof SlotFillingBehaviour];
