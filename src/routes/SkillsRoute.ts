import { Elysia } from 'elysia';
import { skillsHandler } from '~handlers/SkillsHandler';
import { isAuthenticated, isAdmin } from '~middlewares/Auth';

// Usage in route configuration
export const configureSkillsRoutes = new Elysia({ prefix: '/skill' })
    .get('/', skillsHandler.getSkills)
    // .post('/', skillsHandler.createPost, {
    //     beforeHandle: [isAuthenticated, isAdmin],
    //     body: skillsHandler.validateCreatePost,
    // })
    .delete('/:id', skillsHandler.deleteSkill, {
        beforeHandle: [isAuthenticated, isAdmin],
    })
    .patch('/:id', skillsHandler.updateSkill);
