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
    tokenInvalid,
} from '~messages/failure';
import { QueryResult } from 'pg';
import User from '~types/User';
import RefreshToken from '~types/RefreshToken';

interface RegisterPayload {
    username: string;
    password: string;
    email: string;
}

interface LoginPayload {
    username: string;
    password: string;
}

interface AuthHandlerProps {
    jwt: any;
    refreshJwt: any;
    body: any;
    setCookie: any;
    set: any;
}

interface TokenHandlerProps {
    jwt: any;
    refreshJwt: any;
    cookie: { refresh_token: string };
    set: any;
}

const updateLastLogin = (username: string) => {
    const lastLogin = new Date();
    pool.query('UPDATE public.users SET last_login = $1 WHERE username = $2', [
        lastLogin,
        username,
    ]);
};

export const authHandler = {
    login: async ({
        jwt,
        refreshJwt,
        body,
        setCookie,
        set,
    }: AuthHandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password } = body as LoginPayload;
            const { rows }: QueryResult<User> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1',
                [username]
            );
            const user = rows[0];
            if (!user) {
                set.status = 404;
                throw new APIError(404, userNotFound);
            }
            const isPasswordMatch = await Bun.password.verify(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                set.status = 401;
                throw new APIError(401, passwordIncorrect);
            }
            const payload = {
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            };
            const accessToken = await jwt.sign(payload);
            const refreshToken = await refreshJwt.sign(payload);

            // setCookie('access_token', accessToken, {
            //     maxAge: 15 * 60,
            //     path: '/',
            // });
            // Set cookie to refresh token and header to access token
            setCookie('refresh_token', refreshToken, {
                maxAge: 15 * 60,
                path: '/',
            });
            set.headers['Authorization'] = `Bearer ${accessToken}`;
            set.status = 200;
            const response: ApiResponse = {
                status: 200,
                message: loginSuccess,
                data: {
                    accessToken,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.is_admin,
                    avatar: user.avatar,
                    createdAt: user.created_at,
                    lastLogin: user.last_login,
                },
                timestamp: new Date(),
            };
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
        refreshJwt,
        body,
        setCookie,
        set,
    }: AuthHandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password, email } = body as RegisterPayload;
            const { rows }: QueryResult<User> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1 OR email = $2',
                [username, email]
            );
            if (rows.length > 0) {
                set.status = 409;
                throw new APIError(409, userOrEmailExists);
            }
            const hashedPassword = await Bun.password.hash(password);
            const { rows: newUserRows }: QueryResult<User> = await pool.query(
                'INSERT INTO public.users (username, password, email, avatar, is_admin, last_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [username, hashedPassword, email, '', false, new Date()]
            );
            const user = newUserRows[0];
            const payload = {
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            };
            const accessToken = await jwt.sign(payload);
            const refreshToken = await refreshJwt.sign(payload);
            // Set access token to header and refresh token to cookie
            set.headers['Authorization'] = `Bearer ${accessToken}`;
            setCookie('refresh_token', refreshToken, {
                maxAge: 15 * 60,
                path: '/',
            });
            set.status = 201;
            const response: ApiResponse = {
                status: 201,
                message: userCreated,
                data: {
                    accessToken,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.is_admin,
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

    // logout: async ({
    //     setCookie,
    //     set,
    // }: AuthHandlerProps): Promise<ApiResponse> => {
    //     setCookie('access_token', '', { maxAge: 0, path: '/' });
    //     set.status = 200;
    //     const response: ApiResponse = {
    //         status: 200,
    //         message: logoutSuccess,
    //         timestamp: new Date(),
    //     };
    //     return response;
    // },

    // createTokens: async ({
    //     jwt,
    //     refreshJwt,
    //     body,
    //     set,
    // }: TokenHandlerProps): Promise<ApiResponse> => {
    //     try {
    //         const { username } = body;
    //         const { rows }: QueryResult<User> = await pool.query(
    //             'SELECT * FROM public.users WHERE username = $1',
    //             [username]
    //         );
    //         const user = rows[0];
    //         if (!user) {
    //             set.status = 404;
    //             throw new APIError(404, userNotFound);
    //         }
    //         const payload = {
    //             username: user.username,
    //             role: user.is_admin ? 'admin' : 'user',
    //         };
    //         const accessToken = await jwt.sign(payload);
    //         const refreshToken = await refreshJwt.sign(payload);
    //         await pool.query(
    //             'INSERT INTO public.refresh_tokens (user_id, token) VALUES ($1, $2)',
    //             [user.id, refreshToken]
    //         );
    //         set.status = 201;
    //         const response: ApiResponse = {
    //             status: 201,
    //             message: 'Token created',
    //             data: {
    //                 accessToken,
    //                 refreshToken,
    //             },
    //             timestamp: new Date(),
    //         };
    //         return response;
    //     } catch (error: any) {
    //         throw new APIError(
    //             error.statusCode || 500,
    //             error.message || internalServerError
    //         );
    //     }
    // },

    refreshToken: async ({
        jwt,
        refreshJwt,
        cookie: { refresh_token },
        set,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const profile = await refreshJwt.verify(refresh_token);
            if (!profile) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refresh_token]
            );
            const auth = rows[0];
            if (!auth) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            const accessToken = await jwt.sign(profile);
            set.status = 200;
            const response: ApiResponse = {
                status: 200,
                message: 'Token refreshed',
                data: {
                    accessToken,
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

    revokeRefreshToken: async ({
        refreshJwt,
        cookie: { refresh_token },
        set,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const profile = await refreshJwt.verify(refresh_token);
            if (!profile) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refresh_token]
            );
            const auth = rows[0];
            if (!auth) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            await pool.query(
                'UPDATE public.refresh_tokens SET revoked_at = $1 WHERE token = $2',
                [new Date(), refresh_token]
            );
            set.status = 200;
            const response: ApiResponse = {
                status: 200,
                message: 'Token revoked',
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

    validateCreateTokens: t.Object({
        username: t.String(),
    }),

    validateRefreshToken: t.Object({
        refreshToken: t.String(),
    }),

    validateRevokeToken: t.Object({
        refreshToken: t.String(),
    }),
};