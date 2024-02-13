import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import ApiResponse from '../../types/APIResponse';
import sql from '../../database/db';
import User from '../../types/user';
import APIError from '../../errors/APIError';

const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';

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
        const profile = await jwt.verify(auth.value);

        if (!profile) {
            set.status = 401;
            return 'Unauthorized';
        }

        return `Hello ${profile.name}`;
    });

    app.post('/login', async ({ jwt, body }) => {
        const { username, password } = body as {
            username: string;
            password: string;
        };
        const [user]: User[] =
            await sql`SELECT * FROM public.users WHERE username = ${username}`;
        if (!user) {
            console.error('User not found');
            // send message to the client user not found
            throw new APIError(404, 'User not found');
        }

        const isPasswordMatch = await Bun.password.verify(
            password,
            user.password
        );
        if (!isPasswordMatch) throw new APIError(401, 'Password incorrect');
        const token = await jwt.sign({ username });
        const response: ApiResponse<string> = {
            status: 200,
            message: 'Login successful',
            data: token,
            timestamp: new Date(),
        };
        return response;
    });

    app.post('/register', async ({ jwt, body }) => {
        const { username, password, email, img } = body as {
            username: string;
            password: string;
            email: string;
            img: string;
        };
        const token = await jwt.sign({ username });
        const response: ApiResponse<string> = {
            status: 201,
            message: 'User created',
            data: token,
            timestamp: new Date(),
        };
        return response;
    });

    return app;
};
