import type { Brand } from "./brand";

export type DigitalRegisterURL = Brand<string | URL, "drurl">;
export type SchoolClientId = Brand<string, "clientId">;

export interface School {
	clientId: SchoolClientId;
	registerUri: DigitalRegisterURL;
	name: string;
	isEnabled: boolean;
}
