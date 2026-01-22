import type { BrandedId } from "./brand";

export type SchoolId = BrandedId<"school">;

export interface School {
	id: SchoolId;
	name: string;
	registerUri: string;
	clientId: string;
	isEnabled: boolean;
}
