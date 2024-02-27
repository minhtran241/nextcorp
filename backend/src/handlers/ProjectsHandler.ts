import APIError from '~errors/APIError';
import { internalServerError } from '~messages/failure';
import pool from '~database/db';
import Cursor from 'pg-cursor';
import slugify from 'slugify';
import { t } from 'elysia';
import ApiResponse from '~types/APIResponse';

const MAX_PROJECTS_FETCH: number = parseInt(
    process.env.MAX_PROJECTS_FETCH || '100'
);

// interface createProjectPayload {
//     title: string;
//     description: string;
//     content: string;
//     thumbnail: string;
//     userId: number;
//     isPublished: boolean;
// }

export const projectsHandler = {
    getProjects: async ({}) => {
        try {
            const client = await pool.connect();
            // use cursor to fetch all projects for better performance
            const cursor = client.query(
                new Cursor('SELECT * FROM public.projects')
            );
            const projects = await cursor.read(MAX_PROJECTS_FETCH);
            cursor.close();
            client.release();
            return projects;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    getProject: async ({
        params: { slug },
        set,
    }: {
        params: { slug: string };
        set: any;
    }) => {
        try {
            const project = await pool.query(
                'SELECT * FROM public.projects WHERE slug = $1',
                [slug]
            );
            if (project.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Project not found');
            }
            console.log(project.rows[0]);
            return project.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // createproject: async ({
    //     body: { title, description, content, thumbnail, userId, isPublished },
    //     set,
    // }: {
    //     body: createprojectPayload;
    //     set: any;
    // }) => {
    //     try {
    //         const slug = slugify(title, {
    //             replacement: '-', // replace spaces with replacement character, defaults to `-`
    //             remove: undefined, // remove characters that match regex, defaults to `undefined`
    //             lower: false, // convert to lower case, defaults to `false`
    //             strict: false, // strip special characters except replacement, defaults to `false`
    //             locale: 'en', // language code of the locale to use, defaults to `en`
    //             trim: true, // trim leading and trailing replacement chars, defaults to `true`
    //         });
    //         const wordCount = content.split(' ').length;
    //         const readTime = Math.ceil(wordCount / 200);
    //         const project = await pool.query(
    //             'INSERT INTO public.projects (title, description, content, slug, thumbnail, word_count, read_time, user_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    //             [
    //                 title,
    //                 description,
    //                 content,
    //                 slug,
    //                 thumbnail,
    //                 wordCount,
    //                 readTime,
    //                 userId,
    //                 isPublished,
    //             ]
    //         );
    //         set.status = 201;
    //         const res: ApiResponse = {
    //             status: 201,
    //             message: 'project created successfully',
    //             data: project.rows[0],
    //             timestamp: new Date(),
    //         };
    //         return res;
    //     } catch (error: any) {
    //         throw new APIError(
    //             error.statusCode || 500,
    //             error.message || internalServerError
    //         );
    //     }
    // },

    deleteProject: async ({
        params: { id },
        set,
    }: {
        params: { id: string };
        set: any;
    }) => {
        try {
            const project = await pool.query(
                'DELETE FROM public.projects WHERE id = $1 RETURNING *',
                [id]
            );
            if (project.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'project not found');
            }

            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Project deleted successfully',
                data: project.rows[0],
                timestamp: new Date(),
            };
            return res;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // Update project content
    updateProject: async ({
        params: { slug },
        body: { content },
        set,
    }: {
        params: { slug: string };
        body: { content: string };
        set: any;
    }) => {
        try {
            const project = await pool.query(
                'UPDATE public.projects SET content = $1 WHERE slug = $2 RETURNING *',
                [content, slug]
            );
            if (project.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Project not found');
            }
            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Project updated successfully',
                data: project.rows[0],
                timestamp: new Date(),
            };
            return res;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // Get view count of a project
    getProjectViewCount: async ({
        params: { slug },
        set,
    }: {
        params: { slug: string };
        set: any;
    }) => {
        try {
            const project = await pool.query(
                'SELECT view_count FROM public.projects WHERE slug = $1',
                [slug]
            );
            if (project.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Project not found');
            }
            return project.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // Increment view count of a project
    incrementProjectViewCount: async ({
        params: { slug },
        set,
    }: {
        params: { slug: string };
        set: any;
    }) => {
        try {
            const project = await pool.query(
                'UPDATE public.projects SET view_count = view_count + 1 WHERE slug = $1 RETURNING *',
                [slug]
            );
            console.log(project.rows[0]);
            if (project.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Project not found');
            }
            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Project view count incremented successfully',
                data: project.rows[0],
                timestamp: new Date(),
            };
            return res;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // validateCreateProject: t.Object({
    //     title: t.String(),
    //     description: t.String(),
    //     content: t.String(),
    //     thumbnail: t.String(),
    //     userId: t.Number(),
    //     isPublished: t.Boolean(),
    // }),
};
