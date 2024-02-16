import { Elysia } from 'elysia';
import { authHandler } from '~handlers/AuthHandler';

export const configureAuthRoutes = new Elysia({ prefix: '/auth' })
    .guard({ body: authHandler.validateLogin }, (guardApp) =>
        guardApp.post('/login', authHandler.login)
    )
    .guard({ body: authHandler.validateRegister }, (guardApp) =>
        guardApp.post('/register', authHandler.register)
    );
