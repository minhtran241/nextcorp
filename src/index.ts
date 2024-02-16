import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';
import { cron } from '@elysiajs/cron';
import { serverTiming } from '@elysiajs/server-timing';
import ApiResponse from './types/APIResponse';
import APIError from './errors/APIError';
import { rateLimitExceeded } from './messages/failure';
import bearer from '@elysiajs/bearer';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { configureAuthRoutes } from './routes/AuthRoute';
import { configureHealthRoutes } from './routes/HealthRoute';
import { configureUsersRoutes } from './routes/UsersRoute';

const app = new Elysia();
const API_PORT = parseInt(process.env.API_PORT || '8080');

app.onError(({ code, error, set }) => {
    if (error instanceof APIError) {
        set.status = error.statusCode;
        const res: ApiResponse = {
            status: error.statusCode,
            message: error.message,
            timestamp: new Date(),
        };
        return res;
    }
    switch (code) {
        case 'NOT_FOUND':
            set.status = 404;
            break;
        case 'INTERNAL_SERVER_ERROR':
            set.status = 500;
            break;
        case 'INVALID_COOKIE_SIGNATURE':
            set.status = 401;
            break;
        case 'VALIDATION':
            set.status = 400;
            break;
        default:
            set.status = 500;
            break;
    }
    const res: ApiResponse = {
        status: set.status,
        message: error.message,
        timestamp: new Date(),
    };
    return res;
});

app.use(
    jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'secret',
        alg: 'HS256',
    })
);
app.use(cookie());
app.use(bearer());
app.use(serverTiming());
app.use(
    rateLimit({
        duration: 60 * 1000, // 1 minute
        max: 100,
        responseMessage: rateLimitExceeded,
    })
);

app.get('/', () => `Welcome to Bun Elysia`)
    .group('/health', configureHealthRoutes)
    .group('/auth', configureAuthRoutes)
    .group('/user', configureUsersRoutes)
    .listen(API_PORT, () => {
        console.log(
            `🦊 Elysia is running at ${app.server?.hostname}:${API_PORT}`
        );
    });

// app.use(
//     cron({
//         name: 'heartbeat',
//         pattern: '*/10 * * * * *',
//         run() {
//             const systemInfo = {
//                 cpu: process.cpuUsage(),
//                 memory: process.memoryUsage(),
//                 uptime: process.uptime(),
//                 port: API_PORT,
//                 heartbeat: new Date(),
//             };
//             console.log(systemInfo);
//         },
//     })
// );

export default app;
