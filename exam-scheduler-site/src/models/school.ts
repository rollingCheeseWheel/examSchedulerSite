import type { Brand, BrandedId } from "./brand";

export type SchoolId = BrandedId<"school">;

export type DigitalRegisterURL = Brand<string,"drurl">;

export interface School {
	id: SchoolId;
	name: string;
	registerUri: DigitalRegisterURL;
	clientId: string;
	isEnabled: boolean;
}
