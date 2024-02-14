import { Elysia } from 'elysia';
import ApiResponse from '../../types/APIResponse';

export const healthController = (app: Elysia) => {
    app.get('/health', async () => {
        const res: ApiResponse = {
            status: 200,
            message: 'Healthy',
            timestamp: new Date(),
        };
        return res;
    });
    return app;
};
