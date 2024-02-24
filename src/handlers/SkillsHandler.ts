import APIError from '~errors/APIError';
import { internalServerError } from '~messages/failure';
import pool from '~database/db';
import Cursor from 'pg-cursor';
import slugify from 'slugify';
import { t } from 'elysia';
import ApiResponse from '~types/APIResponse';

const MAX_SKILLS_FETCH: number = parseInt(
    process.env.MAX_SKILLS_FETCH || '100'
);

// interface createskillPayload {
//     title: string;
//     description: string;
//     content: string;
//     thumbnail: string;
//     userId: number;
//     isPublished: boolean;
// }

export const skillsHandler = {
    getSkills: async ({ query }: { query: any }) => {
        try {
            // Check if there is limit and offset
            const limit = query.limit
                ? parseInt(query.limit)
                : MAX_SKILLS_FETCH;
            const offset = query.offset ? parseInt(query.offset) : 0;

            const client = await pool.connect();
            // use cursor to fetch all skills for better performance
            const cursor = client.query(
                new Cursor(
                    'SELECT * FROM public.skills ORDER BY sorted_order LIMIT $1 OFFSET $2',
                    [limit, offset]
                )
            );
            const skills = await cursor.read(limit);
            cursor.close();
            client.release();
            return skills;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // createskill: async ({
    //     body: { title, description, content, thumbnail, userId, isPublished },
    //     set,
    // }: {
    //     body: createskillPayload;
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
    //         const skill = await pool.query(
    //             'INSERT INTO public.skills (title, description, content, slug, thumbnail, word_count, read_time, user_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
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
    //             message: 'skill created successfully',
    //             data: skill.rows[0],
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

    deleteSkill: async ({
        params: { id },
        set,
    }: {
        params: { id: string };
        set: any;
    }) => {
        try {
            const skill = await pool.query(
                'DELETE FROM public.skills WHERE id = $1 RETURNING *',
                [id]
            );
            if (skill.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Skill not found');
            }

            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Skill deleted successfully',
                data: skill.rows[0],
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

    // Update skill
    updateSkill: async ({
        params: { id },
        body: { name, technologies, sorted_order },
        set,
    }: {
        params: { id: string };
        body: { name: string; technologies: string[]; sorted_order: number };
        set: any;
    }) => {
        try {
            const skill = await pool.query(
                'UPDATE public.skills SET name = $1, technologies = $2, sorted_order = $3 WHERE id = $4 RETURNING *',
                [name, technologies, sorted_order, id]
            );
            if (skill.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Skill not found');
            }
            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Skill updated successfully',
                data: skill.rows[0],
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

    // validateCreateskill: t.Object({
    //     title: t.String(),
    //     description: t.String(),
    //     content: t.String(),
    //     thumbnail: t.String(),
    //     userId: t.Number(),
    //     isPublished: t.Boolean(),
    // }),
};
