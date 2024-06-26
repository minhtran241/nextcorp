import { Elysia } from 'elysia';
import { usersHandler } from '~handlers/UsersHandler';
import { isAuthenticated, isAdmin } from '~middlewares/Auth';

/**
 * configureUsersRoutes object
 *
 * This object configures the users routes
 */
export const configureUsersRoutes = new Elysia({ prefix: '/user' })
    .get('/', usersHandler.getUsers, {
        beforeHandle: [isAuthenticated, isAdmin],
    })
    .post('/', usersHandler.createUser, {
        beforeHandle: [isAuthenticated, isAdmin],
        body: usersHandler.validateCreateUser,
    })
    .get('/:id', usersHandler.getUser)
    .delete('/:id', usersHandler.deleteUser, {
        beforeHandle: [isAuthenticated, isAdmin],
    });
