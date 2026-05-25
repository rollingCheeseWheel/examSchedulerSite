import type { Brand } from "./brand";

export type HttpStatusCode = Brand<number, "statuscode">;

export interface SimpleResult {
	errors?: string[];
	success: boolean;
	statusCode: HttpStatusCode;
}

export interface Result<T> extends SimpleResult {
	data?: T;
}
