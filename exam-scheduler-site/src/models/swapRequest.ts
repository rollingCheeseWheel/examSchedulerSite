import type { BrandedId } from "./brand";
import type { ExamSlotId, ScheduleId } from "./schedule";
import type { UserProfileId } from "./user";

export type SwapRequestId = BrandedId<"swaprequest">;

export interface SwapRequest {
	id: SwapRequestId;
	scheduleId: ScheduleId;
	requestingStudentName: string;
	requestingStudentId: UserProfileId;
	requestedSlotId: ExamSlotId;
}