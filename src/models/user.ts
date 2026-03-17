import type { BrandedId, BrandedString } from "./brand";
import type { UserRole } from "./enums";

export type UserProfileId = BrandedId<"userprofile">;
export type Username = BrandedString<"username">;

export interface UserProfile {
	id: UserProfileId;
	name: Username;
	role: UserRole;
}
