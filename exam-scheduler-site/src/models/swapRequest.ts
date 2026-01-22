import type { BrandedId } from "./brand";
import type { ScheduleId } from "./schedule";
import type { UserProfileId } from "./user";

export type SwapRequestId = BrandedId<"swaprequest">;

export interface SwapRequest {
	id: SwapRequestId;
	scheduleId: ScheduleId;
	requestingStudentName: string;
	requestedStudentName: string;
	requestingStudentId: UserProfileId;
	requestedStudentId: UserProfileId;
	expirationDate: Date;
}
