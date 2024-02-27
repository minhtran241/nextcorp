import { Elysia } from 'elysia';
import { milestonesHandler } from '~handlers/MilestonesHandler';
import { isAuthenticated, isAdmin } from '~middlewares/Auth';

// Usage in route configuration
export const configureMilestonesRoutes = new Elysia({ prefix: '/milestone' })
    .get('/', milestonesHandler.getMilestones)
    // .post('/', milestonesHandler.createPost, {
    //     beforeHandle: [isAuthenticated, isAdmin],
    //     body: milestonesHandler.validateCreatePost,
    // })
    .delete('/:id', milestonesHandler.deleteMilestone, {
        beforeHandle: [isAuthenticated, isAdmin],
    })
    .patch('/:slug', milestonesHandler.updateMilestone);
