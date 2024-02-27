import { Elysia } from 'elysia';
import ApiResponse from '../types/APIResponse';

export const configureHealthRoutes = new Elysia({ prefix: '/health' }).get(
    '/',
    async () => {
        const res: ApiResponse = {
            status: 200,
            message: 'Healthy',
            timestamp: new Date(),
        };
        return res;
    }
);
