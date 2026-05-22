import { api } from "../main";
import type { Brand } from "./brand";

export type HttpStatusCode = Brand<number, "statuscode">;

export interface NonGenericResult {
	errors?: string[];
}

export interface Result<T> extends NonGenericResult {
	data?: T;
}
