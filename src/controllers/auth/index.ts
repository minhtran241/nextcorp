import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import ApiResponse from '../../types/APIResponse';
import sql from '../../database/db';
import User from '../../types/user';
import APIError from '../../errors/APIError';

const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';

// handle last login when user logs in (asynchronously) (need to optimize this later on)
const updateLastLogin = async (username: string) => {
    const lastLogin = new Date();
    await sql`UPDATE public.users SET last_login = ${lastLogin} WHERE username = ${username}`;
};

export const authController = (app: Elysia) => {
    app.use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        })
    );

    app.get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
        const token = await jwt.sign(params);
        auth.set({
            value: token,
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/profile',
        });
        return `Sign in as ${auth.value}`;
    });

    app.get('/profile', async ({ jwt, set, cookie: { auth } }) => {
        try {
            const profile = await jwt.verify(auth.value);
            if (!profile) {
                throw new APIError(401, 'Unauthorized');
            }
            return `Hello ${profile.name}`;
        } catch (error: any) {
            set.status = error.statusCode || 500;
            return error.message || 'Internal Server Error';
        }
    });

    app.post('/login', async ({ jwt, body }) => {
        try {
            const { username, password } = body as {
                username: string;
                password: string;
            };
            const [user]: User[] =
                await sql`SELECT * FROM public.users WHERE username = ${username}`;
            if (!user) {
                throw new APIError(404, 'User not found');
            }
            const isPasswordMatch = await Bun.password.verify(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                throw new APIError(401, 'Password incorrect');
            }
            const token = await jwt.sign({ username });
            // update last login
            updateLastLogin(username);
            const response: ApiResponse = {
                status: 200,
                message: 'Login successful',
                data: {
                    token,
                    username: user.username,
                    isAdmin: user.isAdmin,
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
                error.message || 'Internal Server Error'
            );
        }
    });

    app.post('/register', async ({ jwt, body }) => {
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
            const token = await jwt.sign({ username });
            const response: ApiResponse = {
                status: 201,
                message: 'User created',
                data: {
                    token,
                    username,
                    isAdmin: false,
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
                error.message || 'Internal Server Error'
            );
        }
    });

    return app;
};
