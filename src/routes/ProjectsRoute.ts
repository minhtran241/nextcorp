import { Elysia } from 'elysia';
import { projectsHandler } from '~handlers/ProjectsHandler';
import { isAuthenticated, isAdmin } from '~middlewares/Auth';

// Usage in route configuration
export const configureProjectsRoutes = new Elysia({ prefix: '/project' })
    .get('/', projectsHandler.getProjects)
    // .post('/', projectsHandler.createPost, {
    //     beforeHandle: [isAuthenticated, isAdmin],
    //     body: projectsHandler.validateCreatePost,
    // })
    .get('/:slug', projectsHandler.getProject)
    .delete('/:id', projectsHandler.deleteProject, {
        beforeHandle: [isAuthenticated, isAdmin],
    })
    // get view count of a post
    .get('/:slug/view', projectsHandler.getProjectViewCount)
    .patch('/:slug', projectsHandler.updateProject)
    //Increment view count of a post
    .patch('/:slug/view', projectsHandler.incrementProjectViewCount);
