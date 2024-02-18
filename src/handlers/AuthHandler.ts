import { t } from 'elysia';
import ApiResponse from '~types/APIResponse';
import pool from '~database/db';
import APIError from '~errors/APIError';
import { loginSuccess, logoutSuccess, userCreated } from '~messages/success';
import {
    userNotFound,
    passwordIncorrect,
    internalServerError,
    userOrEmailExists,
    tokenInvalid,
} from '~messages/failure';
import { QueryResult } from 'pg';
import UserModel from '~types/User';
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
    body: any;
    setCookie: any;
    set: any;
}

interface TokenHandlerProps {
    jwt: any;
    refreshJwt: any;
    body: any;
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
        body,
        setCookie,
    }: AuthHandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password } = body as LoginPayload;
            const { rows }: QueryResult<UserModel> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1',
                [username]
            );
            const user = rows[0];
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
                maxAge: 15 * 60,
                path: '/',
            });
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
        body,
        setCookie,
        set,
    }: AuthHandlerProps): Promise<ApiResponse> => {
        try {
            const { username, password, email } = body as RegisterPayload;
            const { rows }: QueryResult<UserModel> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1 OR email = $2',
                [username, email]
            );
            if (rows.length > 0) throw new APIError(409, userOrEmailExists);
            const hashedPassword = await Bun.password.hash(password);
            const { rows: newUserRows }: QueryResult<UserModel> =
                await pool.query(
                    'INSERT INTO public.users (username, password, email, avatar, is_admin, last_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [username, hashedPassword, email, '', false, new Date()]
                );
            const user = newUserRows[0];
            const accessToken = await jwt.sign({
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            });
            setCookie('access_token', accessToken, {
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

    logout: async ({ setCookie }: AuthHandlerProps): Promise<ApiResponse> => {
        setCookie('access_token', '', { maxAge: 0, path: '/' });
        const response: ApiResponse = {
            status: 201,
            message: logoutSuccess,
            timestamp: new Date(),
        };
        return response;
    },

    createTokens: async ({
        jwt,
        refreshJwt,
        body,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const { username } = body;
            const { rows }: QueryResult<UserModel> = await pool.query(
                'SELECT * FROM public.users WHERE username = $1',
                [username]
            );
            const user = rows[0];
            if (!user) throw new APIError(404, userNotFound);
            const payload = {
                username: user.username,
                role: user.is_admin ? 'admin' : 'user',
            };
            const accessToken = await jwt.sign(payload);
            const refreshToken = await refreshJwt.sign(payload);
            await pool.query(
                'INSERT INTO public.refresh_tokens (userId, token) VALUES ($1, $2)',
                [user.id, refreshToken]
            );
            const response: ApiResponse = {
                status: 201,
                message: 'Token refreshed',
                data: {
                    accessToken,
                    refreshToken,
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

    refreshToken: async ({
        jwt,
        refreshJwt,
        body,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const { refreshToken } = body;
            const profile = await refreshJwt.verify(refreshToken);
            if (!profile) throw new APIError(404, tokenInvalid);
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refreshToken]
            );
            const auth = rows[0];
            if (!auth) throw new APIError(404, tokenInvalid);
            const accessToken = await jwt.sign(profile);
            const response: ApiResponse = {
                status: 200,
                message: 'Access token updated',
                data: {
                    accessToken,
                },
                timestamp: new Date(),
            };
            return response;
        } catch (error: any) {
            console.error(error);
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    revokeRefreshToken: async ({
        body,
        refreshJwt,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const { refreshToken } = body;
            const profile = await refreshJwt.verify(refreshToken);
            if (!profile) throw new APIError(404, tokenInvalid);
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refreshToken]
            );
            const auth = rows[0];
            if (!auth) throw new APIError(404, tokenInvalid);
            await pool.query(
                'UPDATE public.refresh_tokens SET revoked_at = $1 WHERE token = $2',
                [new Date(), refreshToken]
            );
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
