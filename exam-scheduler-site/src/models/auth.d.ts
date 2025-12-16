export interface OAuthRequest {
    authCode: string;
    schoolId: string;
}

export interface TokenExtendRequest {
    refreshToken: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}