import { Elysia } from 'elysia';
import { usersHandler } from '~handlers/UsersHandler';
import { isAdmin, isAuthenticated } from '~middlewares/auth';

export const configureUsersRoutes = (app) => {
    return app
        .get('/', usersHandler.getUsers, {
            beforeHandle: [isAuthenticated, isAdmin],
        })
        .post('/', usersHandler.createUser, {
            beforeHandle: isAuthenticated,
            body: usersHandler.validateCreateUser,
        })
        .get('/:username', usersHandler.getUser, {
            beforeHandle: isAuthenticated,
            body: usersHandler.validateGetUser,
        })
        .delete('/:id', usersHandler.deleteUser, {
            beforeHandle: isAuthenticated,
            body: usersHandler.validateDeleteUser,
        });
};
