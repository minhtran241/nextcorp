import { t } from 'elysia';
import ApiResponse from '~types/APIResponse';
import pool from '~database/db';
import APIError from '~errors/APIError';
import { loginSuccess, userCreated } from '~messages/success';
import {
    userNotFound,
    passwordIncorrect,
    internalServerError,
    userOrEmailExists,
} from '~messages/failure';
import { QueryResult } from 'pg';
import UserModel from '~types/user';

interface RegisterPayload {
    username: string;
    password: string;
    email: string;
}

interface LoginPayload {
    username: string;
    password: string;
}

interface HandlerProps {
    jwt: any;
    body: any;
    setCookie: any;
}

// handle last login when user logs in (asynchronously) (need to optimize this later on)
// In order to avoid the case that user requests to login multiple times in a short period of time, we need to use redis to store the last login time and check if the user has logged in within a certain period of time. If the user has logged in within a certain period of time, we will not update the last login time and return the last jwt token to the user.
const updateLastLogin = async (username: string) => {
    const lastLogin = new Date();
    await pool.query(
        'UPDATE public.users SET last_login = $1 WHERE username = $2',
        [lastLogin, username]
    );
};

export const authHandler = {
    login: async ({
        jwt,
        body,
        setCookie,
    }: HandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password } = body as LoginPayload;
            const users: QueryResult<UserModel> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1',
                [username]
            );
            const user = users.rows[0];
            if (!user) throw new APIError(404, userNotFound);

            const isPasswordMatch = await Bun.password.verify(
                password,
                user.password
            );
            if (!isPasswordMatch) throw new APIError(401, passwordIncorrect);

            const accessToken = await jwt.sign({
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            });
            setCookie('access_token', accessToken, {
                maxAge: 15 * 60, // 15 minutes
                path: '/',
            });
            const response: ApiResponse = {
                status: 200,
                message: loginSuccess,
                data: {
                    accessToken,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    createdAt: user.created_at,
                    lastLogin: user.last_login,
                },
                timestamp: new Date(),
            };
            // update last login
            updateLastLogin(username);
            return response;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    register: async ({
        jwt,
        body,
        setCookie,
    }: HandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password, email } = body as RegisterPayload;
            // only allow unique username and email
            const users: QueryResult<UserModel> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1 OR email = $2',
                [username, email]
            );
            if (users.rows.length > 0) {
                throw new APIError(409, userOrEmailExists);
            }
            const hashedPassword = await Bun.password.hash(password);
            const newUser: QueryResult<UserModel> = await pool.query(
                'INSERT INTO public.users (username, password, email, avatar, isadmin, last_login) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [username, hashedPassword, email, '', false, new Date()]
            );
            const user = newUser.rows[0];
            const accessToken = await jwt.sign({
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            });
            setCookie('access_token', accessToken, {
                maxAge: 15 * 60, // 15 minutes
                path: '/',
            });
            const response: ApiResponse = {
                status: 201,
                message: userCreated,
                data: {
                    accessToken,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    createdAt: user.created_at,
                    lastLogin: user.last_login,
                },
                timestamp: new Date(),
            };
            return response;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    validateLogin: t.Object({
        username: t.String(),
        password: t.String(),
    }),

    validateRegister: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.String(),
    }),
};
