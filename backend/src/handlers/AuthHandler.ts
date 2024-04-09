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

/**
 * RegisterPayload
 *
 * This interface defines the payload for registering a user
 */
interface RegisterPayload {
    username: string;
    password: string;
    email: string;
}

/**
 * LoginPayload
 *
 * This interface defines the payload for logging in a user
 */
interface LoginPayload {
    username: string;
    password: string;
}

/**
 * AuthHandlerProps
 *
 * This interface defines the props for the AuthHandler
 */
interface AuthHandlerProps {
    jwt: any;
    refreshJwt: any;
    body: any;
    setCookie: any;
    set: any;
}

/**
 * TokenHandlerProps
 *
 * This interface defines the props for the TokenHandler
 */
interface TokenHandlerProps {
    jwt: any;
    refreshJwt: any;
    cookie: { refresh_token: string };
    set: any;
    body: any;
}

/**
 * Update the last login date of a user
 *
 * @param username
 */
const updateLastLogin = async (username: string) => {
    const lastLogin = new Date();
    await pool.query(
        'UPDATE public.users SET last_login = $1 WHERE username = $2',
        [lastLogin, username]
    );
};

/**
 * Insert a refresh token into the database
 *
 * @param token
 * @param username
 */
const insertRefreshToken = async (token: string, username: string) => {
    let userId = await pool.query(
        'SELECT id FROM public.users WHERE username = $1',
        [username]
    );
    userId = userId.rows[0].id;
    await pool.query(
        'INSERT INTO public.refresh_tokens (token, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [token, userId]
    );
};

/**
 * AuthHandler
 *
 * This class is used to handle authentication
 *
 * @param {any} jwt - The JWT instance
 * @param {any} refreshJwt - The refresh JWT instance
 * @param {any} body - The request body
 * @param {any} setCookie - The set cookie function
 * @param {any} set - The set function
 */
export const authHandler = {
    /**
     * Login a user
     *
     * @param {AuthHandlerProps} - The auth handler props
     * @returns {Promise<ApiResponse>} - The response
     * @throws {APIError} - If an error occurs
     */
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
                username: username,
                role: user.is_admin ? 'admin' : 'user',
            };
            const accessToken = await jwt.sign(payload);
            const refreshToken = await refreshJwt.sign(payload);

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
            await updateLastLogin(username);
            await insertRefreshToken(refreshToken, username);
            return response;
        } catch (error: any) {
            // console.log(error);
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    /**
     * Register a user
     *
     * @param {AuthHandlerProps} - The auth handler props
     * @returns {Promise<ApiResponse>} - The response
     * @throws {APIError} - If an error occurs
     */
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
                username: username,
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
            await insertRefreshToken(refreshToken, username);
            return response;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    /**
     * Create tokens
     *
     * @param {AuthHandlerProps} - The auth handler props
     * @returns {Promise<ApiResponse>} - The response
     * @throws {APIError} - If an error occurs
     */
    refreshToken: async ({
        jwt,
        refreshJwt,
        cookie,
        set,
        body,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const refreshToken = cookie.refresh_token || body.refreshToken;
            const profile = await refreshJwt.verify(refreshToken);
            if (!profile) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refreshToken]
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

    /**
     * Revoke a refresh token
     *
     * @param {TokenHandlerProps} - The token handler props
     * @returns {Promise<ApiResponse>} - The response
     * @throws {APIError} - If an error occurs
     */
    revokeRefreshToken: async ({
        refreshJwt,
        cookie: { refresh_token },
        set,
        body,
    }: TokenHandlerProps): Promise<ApiResponse> => {
        try {
            const refreshToken = refresh_token || body.refreshToken;
            const profile = await refreshJwt.verify(refreshToken);
            if (!profile) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            const { rows }: QueryResult<RefreshToken> = await pool.query(
                'SELECT * FROM public.refresh_tokens WHERE token = $1 AND revoked_at IS NULL',
                [refreshToken]
            );
            const auth = rows[0];
            if (!auth) {
                set.status = 404;
                throw new APIError(404, tokenInvalid);
            }
            await pool.query(
                'UPDATE public.refresh_tokens SET revoked_at = $1 WHERE token = $2',
                [new Date(), refreshToken]
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
