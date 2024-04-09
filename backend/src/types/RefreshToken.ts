// Type definition for RefreshToken
export default interface RefreshToken {
    id: number;
    user_id: number;
    token: string;
    revoked_at: Date;
    created_at: Date;
}
