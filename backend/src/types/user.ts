// Type definition for User
export default interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    avatar: string;
    is_admin: boolean;
    created_at: Date;
    last_login: Date;
}
