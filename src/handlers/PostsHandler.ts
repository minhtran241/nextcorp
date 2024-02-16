import APIError from '~errors/APIError';
import { badRequest, internalServerError } from '~messages/failure';
import pool from '~database/db';
import Cursor from 'pg-cursor';
import slugify from 'slugify';
import { t } from 'elysia';

const MAX_POSTS_FETCH: number = parseInt(process.env.MAX_POSTS_FETCH || '100');

interface createPostPayload {
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    userId: number;
    isPublished: boolean;
}

export const postsHandler = {
    getPosts: async ({}) => {
        try {
            const client = await pool.connect();
            // use cursor to fetch all posts for better performance
            const cursor = client.query(
                new Cursor('SELECT * FROM public.posts')
            );
            const posts = await cursor.read(MAX_POSTS_FETCH);
            cursor.close();
            client.release();
            return posts;
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    getPost: async ({ params: { slug } }: { params: { slug: string } }) => {
        try {
            const post = await pool.query(
                'SELECT * FROM public.posts WHERE slug = $1',
                [slug]
            );
            if (post.rows.length === 0) {
                throw new APIError(404, 'Post not found');
            }
            return post.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    createPost: async ({
        body: { title, description, content, thumbnail, userId, isPublished },
    }: {
        body: createPostPayload;
    }) => {
        // check if some fields are empty
        if (!title || !description || !content || !thumbnail || !userId) {
            throw new APIError(400, badRequest);
        }
        try {
            const slug = slugify(title, {
                replacement: '-', // replace spaces with replacement character, defaults to `-`
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: false, // convert to lower case, defaults to `false`
                strict: false, // strip special characters except replacement, defaults to `false`
                locale: 'en', // language code of the locale to use, defaults to `en`
                trim: true, // trim leading and trailing replacement chars, defaults to `true`
            });
            const wordCount = content.split(' ').length;
            const readTime = Math.ceil(wordCount / 200);
            const post = await pool.query(
                'INSERT INTO public.posts (title, description, content, slug, thumbnail, word_count, read_time, user_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                [
                    title,
                    description,
                    content,
                    slug,
                    thumbnail,
                    wordCount,
                    readTime,
                    userId,
                    isPublished,
                ]
            );
            return post.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    deletePost: async ({ params: { id } }: { params: { id: string } }) => {
        try {
            const post = await pool.query(
                'DELETE FROM public.posts WHERE id = $1 RETURNING *',
                [id]
            );
            if (post.rows.length === 0) {
                throw new APIError(404, 'Post not found');
            }
            return post.rows[0];
        } catch (error: any) {
            throw new APIError(
                error.statusCode || 500,
                error.message || internalServerError
            );
        }
    },

    validateCreatePost: t.Object({
        title: t.String(),
        description: t.String(),
        content: t.String(),
        thumbnail: t.String(),
        userId: t.Number(),
        isPublished: t.Boolean(),
    }),
};
