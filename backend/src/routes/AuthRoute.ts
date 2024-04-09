import { Elysia } from 'elysia';
import { authHandler } from '~handlers/AuthHandler';

/**
 * configureAuthRoutes object
 *
 * This object configures the auth routes
 */
export const configureAuthRoutes = new Elysia({ prefix: '/auth' })
    .guard({ body: authHandler.validateLogin }, (guardApp) =>
        guardApp.post('/login', authHandler.login)
    )
    .guard({ body: authHandler.validateRegister }, (guardApp) =>
        guardApp.post('/register', authHandler.register)
    )
    // .post('/logout', authHandler.logout)
    // .guard({ body: authHandler.validateCreateTokens }, (guardApp) =>
    //     guardApp.post('/create-tokens', authHandler.createTokens)
    // )
    .guard({ body: authHandler.validateRefreshToken }, (guardApp) =>
        guardApp.post('/refresh', authHandler.refreshToken)
    )
    .guard({ body: authHandler.validateRevokeToken }, (guardApp) =>
        guardApp.post('/revoke', authHandler.revokeRefreshToken)
    );
