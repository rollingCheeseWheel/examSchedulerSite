import type { Brand } from "./brand";

export type HttpStatusCode = Brand<number, "statuscode">;

export interface Result<T> {
	errors?: object[];
	data?: T;
	statusCode: HttpStatusCode;
	success: boolean;
}
