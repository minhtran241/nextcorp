import { Elysia } from 'elysia';
import ApiResponse from '../types/APIResponse';

/**
 * configureHealthRoutes object
 *
 * This object configures the health routes
 */
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
