import { t } from 'elysia';
import { internalServerError, userNotFound } from '~messages/failure';
import pool from '~database/db';
import Cursor from 'pg-cursor';
import APIError from '~errors/APIError';

const MAX_USERS_FETCH: number = parseInt(process.env.MAX_USERS_FETCH || '100');
interface createUserPayload {
    username: string;
    password: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
}

interface loginPayload {
    username: string;
    password: string;
}

export const usersHandler = {
    getUsers: async ({}) => {
        try {
            const client = await pool.connect();
            // use cursor to fetch all users for better performance
            const cursor = client.query(
                new Cursor('SELECT * FROM public.users')
            );
            const users = await cursor.read(MAX_USERS_FETCH);
            cursor.close();
            client.release();
            return users;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    getUser: async ({ params: { id } }: { params: { id: string } }) => {
        try {
            const user = await pool.query(
                'SELECT * FROM public.users WHERE id = $1',
                [parseInt(id)]
            );
            if (user.rows.length === 0) {
                throw new APIError(404, userNotFound);
            }
            delete user.rows[0].password;
            console.log(user.rows[0]);
            return user.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    createUser: async ({
        body: { username, password, email, avatar, isAdmin },
    }: {
        body: createUserPayload;
    }) => {
        try {
            const hashedPassword = await Bun.password.hash(password);
            const user = await pool.query(
                'INSERT INTO public.users (username, password, email, avatar, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [username, hashedPassword, email, avatar, isAdmin]
            );
            return user.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    deleteUser: async ({
        params: { username },
    }: {
        params: { username: string };
    }) => {
        try {
            const user = await pool.query(
                'DELETE FROM public.users WHERE username = $1 RETURNING *',
                [username]
            );
            if (user.rows.length === 0) {
                throw new APIError(404, userNotFound);
            }
            return user.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    validateCreateUser: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.String(),
        avatar: t.String(),
        isAdmin: t.Boolean(),
    }),
};
