import type { BrandedId } from "./brand";
import type { UserRole } from "./enums";

export type UserProfileId = BrandedId<"userprofile">;

export interface UserProfile {
	id: UserProfileId;
	name: string;
	role: UserRole;
}
