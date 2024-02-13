import { Elysia } from 'elysia';
import { authController } from './controllers/auth';
import ApiResponse from './types/APIResponse';
import APIError from './errors/APIError';

const app = new Elysia();
const PORT = 8080;

app.onError(({ code, error, set }) => {
    if (error instanceof APIError) {
        set.status = error.status;
        const res: ApiResponse<string> = {
            status: error.status,
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
    const res: ApiResponse<string> = {
        status: set.status,
        message: error.message,
        timestamp: new Date(),
    };
    return res;
});

app.use(authController);

app.listen(PORT, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${PORT}`);
});

export default app;
