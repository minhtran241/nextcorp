import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';
import { cron } from '@elysiajs/cron';
import { serverTiming } from '@elysiajs/server-timing';
import APIError from './errors/APIError';
import { rateLimitExceeded } from './messages/failure';
import bearer from '@elysiajs/bearer';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { configureAuthRoutes } from './routes/AuthRoute';
import { configureHealthRoutes } from './routes/HealthRoute';
import { configureUsersRoutes } from './routes/UsersRoute';
import { configurePostsRoutes } from './routes/PostsRoute';
import cors from '@elysiajs/cors';

const app = new Elysia();
const API_PORT = parseInt(process.env.API_PORT || '8080');

// JWT Config
const jwtConfig = {
    secret: process.env.JWT_SECRET || 'secret',
    alg: 'HS256',
    // exp: 60 * 60 * 24, // 1 day expiration
    iss: 'nextcorp',
    sub: 'access',
    iat: new Date().getTime(),
};

// Refresh JWT Config
const refreshJwtConfig = {
    secret: process.env.JWT_REFRESH || 'refresh',
    alg: 'HS256',
    // exp: 60 * 60 * 24 * 365, // 1 year expiration
    iss: 'nextcorp',
    sub: 'refresh',
    iat: new Date().getTime(),
};

// Error handler
const errorHandler = ({ error, set }: { error: Error; set: any }) => {
    return {
        status: set.status,
        message:
            error instanceof APIError
                ? error.message
                : error.message || 'Unknown error',
        timestamp: new Date(),
    };
};

// Configure app
app.onError(errorHandler)
    .use(cors())
    .use(jwt({ name: 'jwt', ...jwtConfig }))
    .use(jwt({ name: 'refreshJwt', ...refreshJwtConfig }))
    .use(cookie())
    .use(bearer())
    .use(serverTiming());

// if (process.env.ENV === 'prod') {
//     app.use(
//         cron({
//             name: 'heartbeat',
//             pattern: '*/10 * * * * *',
//             run() {
//                 const systemInfo = {
//                     cpu: process.cpuUsage(),
//                     memory: process.memoryUsage(),
//                     uptime: process.uptime(),
//                     port: API_PORT,
//                     heartbeat: new Date(),
//                 };
//                 console.log(systemInfo);
//             },
//         })
//     );
// }

// Routes
app.use(configureHealthRoutes)
    .use(configureAuthRoutes)
    .use(configureUsersRoutes)
    .use(configurePostsRoutes);

app.use(rateLimit()).listen(API_PORT, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${API_PORT}`);
});

export default app;
