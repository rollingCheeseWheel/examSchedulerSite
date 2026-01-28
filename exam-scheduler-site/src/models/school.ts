import type { Brand } from "./brand";

export type DigitalRegisterURL = Brand<string | URL,"drurl">;

export interface School {
	clientId: string;
	registerUri: DigitalRegisterURL;
	name: string;
	isEnabled: boolean;
}
