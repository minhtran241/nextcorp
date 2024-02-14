import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';
import { cron } from '@elysiajs/cron';
import { serverTiming } from '@elysiajs/server-timing';
import { authController } from './controllers/auth';
import ApiResponse from './types/APIResponse';
import APIError from './errors/APIError';
import { rateLimitExceeded } from './messages/failure';
import { healthController } from './controllers/health';

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

app.use(healthController);
app.use(authController);

app.use(
    rateLimit({
        duration: 60 * 1000, // 1 minute
        max: 100,
        responseMessage: rateLimitExceeded,
    })
);
app.use(
    cron({
        name: 'heartbeat',
        pattern: '*/10 * * * * *',
        run() {
            const systemInfo = {
                cpu: process.cpuUsage(),
                memory: process.memoryUsage(),
                uptime: process.uptime(),
                port: API_PORT,
                heartbeat: new Date(),
            };
            console.log(systemInfo);
        },
    })
);
app.use(serverTiming());
app.listen(API_PORT, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${API_PORT}`);
});

export default app;
