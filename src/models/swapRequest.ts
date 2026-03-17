import type { BrandedId } from "./brand";
import type { ExamSlotId } from "./schedule";
import type { UserProfileId } from "./user";

export type SwapRequestId = BrandedId<"swaprequest">;

export interface SwapRequest {
	id: SwapRequestId;
	requestingStudentName: string;
	requestingStudentId: UserProfileId;
	requestedSlotId: ExamSlotId;
}
