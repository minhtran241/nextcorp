import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import ApiResponse from '../../types/APIResponse';
import sql from '../../database/db';
import User from '../../types/user';
import APIError from '../../errors/APIError';
import { loginSuccess, userCreated } from '../../messages/success';
import {
    userNotFound,
    passwordIncorrect,
    internalServerError,
} from '../../messages/failure';

const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';

// handle last login when user logs in (asynchronously) (need to optimize this later on)
// In order to avoid the case that user requests to login multiple times in a short period of time, we need to use redis to store the last login time and check if the user has logged in within a certain period of time. If the user has logged in within a certain period of time, we will not update the last login time and return the last jwt token to the user.
const updateLastLogin = async (username: string) => {
    const lastLogin = new Date();
    await sql`UPDATE public.users SET last_login = ${lastLogin} WHERE username = ${username}`;
};

export const authController = (app: Elysia) => {
    app.use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,
            alg: 'HS256',
        })
    )
        .get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
            const token = await jwt.sign(params);
            auth.set({
                value: token,
                httpOnly: true,
                maxAge: 7 * 86400,
                path: '/profile',
            });
            return `Sign in as ${auth.value}`;
        })
        .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
            try {
                const profile = await jwt.verify(auth.value);
                if (!profile) {
                    throw new APIError(401, 'Unauthorized');
                }
                return `Hello ${profile.name}`;
            } catch (error: any) {
                set.status = error.statusCode || 500;
                return error.message || internalServerError;
            }
        })
        // LOGIN ROUTE HANDLER
        .post('/login', async ({ jwt, body }) => {
            try {
                const { username, password } = body as {
                    username: string;
                    password: string;
                };
                const [user]: User[] =
                    await sql`SELECT * FROM public.users WHERE username = ${username}`;
                if (!user) throw new APIError(404, userNotFound);

                const isPasswordMatch = await Bun.password.verify(
                    password,
                    user.password
                );
                if (!isPasswordMatch)
                    throw new APIError(401, passwordIncorrect);

                const token = await jwt.sign({
                    username: user.username,
                    isAdmin: (user.isAdmin || 'false').toString(),
                });
                const response: ApiResponse = {
                    status: 200,
                    message: loginSuccess,
                    data: {
                        token,
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
        })
        // REGISTER ROUTE HANDLER
        .post('/register', async ({ jwt, body }) => {
            try {
                const { username, password, email, avatar } = body as {
                    username: string;
                    password: string;
                    email: string;
                    avatar: string;
                };
                const hashedPass = await Bun.password.hash(password);
                const lastLogin = new Date();
                await sql`INSERT INTO public.users (username, password, email, avatar, last_login) VALUES (${username}, ${hashedPass}, ${email}, ${avatar}, ${lastLogin})`;
                const token = await jwt.sign({
                    username,
                    isAdmin: 'false',
                });
                const response: ApiResponse = {
                    status: 201,
                    message: userCreated,
                    data: {
                        token,
                        username,
                        email,
                        avatar,
                        createdAt: new Date(),
                        lastLogin,
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
        });

    return app;
};
