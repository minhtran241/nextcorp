// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it, jest } from 'bun:test';
import jwt from 'jsonwebtoken';
import app from '../src';
import {
    generateMockPost,
    generateMockPostAPIPayload,
} from '../src/utils/mockData';
import TestDBClient from '~utils/TestDBClient';

const generateJWT = (id: number, username: string, role: string) => {
    return jwt.sign(
        {
            id,
            username,
            role,
        },
        process.env.JWT_SECRET || 'secret'
    );
};

const url: string = process.env.API_URL + '/post';

const adminToken: string = generateJWT(1, 'test_admin', 'admin');
const defaultUserToken: string = generateJWT(2, 'test_user', 'user');

// Database client
const dbClient = new TestDBClient();
await dbClient.connect();

describe('Posts endpoint', () => {
    afterAll(async () => {
        await dbClient.disconnect();
    });

    describe('GET POSTS', () => {
        let postCount: number = 0;
        let newPost: any = {};

        afterAll(async () => {
            await dbClient.deletePostById(newPost.id);
        });

        it('Get all current posts. Status: 200. Store the current posts count', async () => {
            const req = new Request(url, {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            // Store the current posts count
            postCount = responseBody.length;
        });

        it('Get all current posts. Status: 200. Check if the current posts count has increased after creating a new post', async () => {
            newPost = await dbClient.createMockPost();
            const req = new Request(url, {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.length).toEqual(postCount + 1);
        });
    });

    describe('GET POST BY SLUG', () => {
        let post: any = {};

        afterAll(async () => {
            await dbClient.deletePostById(post.id);
        });

        beforeAll(async () => {
            // Create a new post
            post = await dbClient.createMockPost();
        });

        it('Get post by slug. Status: 200', async () => {
            const req = new Request(`${url}/${post.slug}`, {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.title).toEqual(post.title);
            expect(responseBody.description).toEqual(post.description);
            expect(responseBody.content).toEqual(post.content);
            expect(responseBody.slug).toEqual(post.slug);
            expect(responseBody.thumbnail).toEqual(post.thumbnail);
            expect(responseBody.word_count).toEqual(post.word_count);
            expect(responseBody.read_time).toEqual(post.read_time);
            expect(responseBody.user_id).toEqual(post.user_id);
            expect(responseBody.is_published).toEqual(post.is_published);
        });

        it('Get post by slug. Status: 404', async () => {
            const req = new Request(`${url}/invalid-slug`, {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(404);
            expect(responseBody.status).toEqual(404);
            expect(responseBody.message).toEqual('Post not found');
        });
    });

    describe('POST POSTS', () => {
        const payload = generateMockPostAPIPayload();
        afterAll(async () => {
            await dbClient.deletePostsByTitle(payload.title);
        });
        it('Post new post. Status: 201', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(payload),
            });
            const res = await app.fetch(req);
            // console.log(res);
            const responseBody = await res.json();
            expect(res.status).toEqual(201);
            expect(responseBody.status).toEqual(201);
            expect(responseBody.message).toEqual('Post created successfully');
            expect(responseBody.data.title).toEqual(payload.title);
            expect(responseBody.data.description).toEqual(payload.description);
            expect(responseBody.data.content).toEqual(payload.content);
            expect(responseBody.data.thumbnail).toEqual(payload.thumbnail);
            expect(responseBody.data.user_id).toEqual(payload.userId);
            expect(responseBody.data.is_published).toEqual(payload.isPublished);
        });
        it('Unauthorized. Status: 401', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(401);
            expect(responseBody.status).toEqual(401);
            expect(responseBody.message).toEqual('Unauthorized');
        });
        it('Forbidden. Status: 403', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${defaultUserToken}`,
                },
                body: JSON.stringify(payload),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(403);
            expect(responseBody.status).toEqual(403);
            expect(responseBody.message).toEqual('Forbidden');
        });
        it('Bad request. Status: 400', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({}),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(400);
            expect(responseBody.status).toEqual(400);
        });
    });

    describe('DELETE POST BY ID', () => {
        let post: any = {};

        beforeAll(async () => {
            // Create a new post
            post = await dbClient.createMockPost();
        });

        it('Delete post by id. Status: 200', async () => {
            const req = new Request(`${url}/${post.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.status).toEqual(200);
            expect(responseBody.message).toEqual('Post deleted successfully');
            expect(responseBody.data.id).toEqual(post.id);
            expect(responseBody.data.title).toEqual(post.title);
            expect(responseBody.data.description).toEqual(post.description);
            expect(responseBody.data.content).toEqual(post.content);
            expect(responseBody.data.slug).toEqual(post.slug);
            expect(responseBody.data.thumbnail).toEqual(post.thumbnail);
            expect(responseBody.data.word_count).toEqual(post.word_count);
            expect(responseBody.data.read_time).toEqual(post.read_time);
            expect(responseBody.data.user_id).toEqual(post.user_id);
            expect(responseBody.data.is_published).toEqual(post.is_published);
        });

        it('Post not found. Status: 404', async () => {
            const req = new Request(`${url}/0`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            // console.log(res);
            const responseBody = await res.json();
            expect(res.status).toEqual(404);
            expect(responseBody.status).toEqual(404);
            expect(responseBody.message).toEqual('Post not found');
        });
    });
});
