export default interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
    created_at: Date;
    last_login: Date;
}
