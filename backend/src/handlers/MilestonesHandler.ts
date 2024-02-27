import APIError from '~errors/APIError';
import { internalServerError } from '~messages/failure';
import pool from '~database/db';
import Cursor from 'pg-cursor';
import slugify from 'slugify';
import { t } from 'elysia';
import ApiResponse from '~types/APIResponse';

const MAX_MILESTONES_FETCH: number = parseInt(
    process.env.MAX_MILESTONES_FETCH || '100'
);

// interface createmilestonePayload {
//     title: string;
//     description: string;
//     content: string;
//     thumbnail: string;
//     userId: number;
//     isPublished: boolean;
// }

export const milestonesHandler = {
    getMilestones: async ({}) => {
        try {
            const client = await pool.connect();
            // use cursor to fetch all milestones for better performance
            const cursor = client.query(
                new Cursor('SELECT * FROM public.milestones ORDER BY date')
            );
            const milestones = await cursor.read(MAX_MILESTONES_FETCH);
            cursor.close();
            client.release();
            return milestones;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    // createmilestone: async ({
    //     body: { title, description, content, thumbnail, userId, isPublished },
    //     set,
    // }: {
    //     body: createmilestonePayload;
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
    //         const milestone = await pool.query(
    //             'INSERT INTO public.milestones (title, description, content, slug, thumbnail, word_count, read_time, user_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
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
    //             message: 'milestone created successfully',
    //             data: milestone.rows[0],
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

    deleteMilestone: async ({
        params: { id },
        set,
    }: {
        params: { id: string };
        set: any;
    }) => {
        try {
            const milestone = await pool.query(
                'DELETE FROM public.milestones WHERE id = $1 RETURNING *',
                [id]
            );
            if (milestone.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Milestone not found');
            }

            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Milestone deleted successfully',
                data: milestone.rows[0],
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

    // CREATE TABLE milestones (
    // 	id SERIAL PRIMARY KEY,
    // 	date VARCHAR(255) NOT NULL,
    // 	title VARCHAR(255) NOT NULL,
    // 	job_title VARCHAR(255) NOT NULL,
    // 	description TEXT NOT NULL,
    // 	icon VARCHAR(255) NOT NULL,
    // 	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    // 	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    // );
    // Update milestone
    updateMilestone: async ({
        params: { id },
        body: { date, title, job_title, description, icon },
        set,
    }: {
        params: { id: string };
        body: {
            date: string;
            title: string;
            job_title: string;
            description: string;
            icon: string;
        };
        set: any;
    }) => {
        try {
            const milestone = await pool.query(
                'UPDATE public.milestones SET date = $1, title = $2, job_title = $3, description = $4, icon = $5 WHERE id = $6 RETURNING *',
                [date, title, job_title, description, icon, id]
            );
            if (milestone.rows.length === 0) {
                set.status = 404;
                throw new APIError(404, 'Milestone not found');
            }

            set.status = 200;
            const res: ApiResponse = {
                status: 200,
                message: 'Milestone updated successfully',
                data: milestone.rows[0],
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

    // validateCreatemilestone: t.Object({
    //     title: t.String(),
    //     description: t.String(),
    //     content: t.String(),
    //     thumbnail: t.String(),
    //     userId: t.Number(),
    //     isPublished: t.Boolean(),
    // }),
};
