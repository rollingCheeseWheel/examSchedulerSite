import type { DateString } from "./brand";
import type { UserProfile } from "./user";

export interface OAuthRequest {
	authCode: string;
	schoolId: string;
}

export interface AuthResponse {
	expiration: DateString;
	user: UserProfile;
}
