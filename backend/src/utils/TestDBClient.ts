import { Client } from 'pg';
import MockPost from '~types/MockPost';
import Post from '~types/Post';
import { generateMockPost, generateMockUser } from './mockData';
import User from '~types/User';
import MockUser from '~types/MockUser';

// const TestDBClient: Client = new Client({
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || '5423'),
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
// });

class TestDBClient {
    client: Client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5423'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    // async query(query: string, values: any) {
    //     return await this.client.query(query, values);
    // }

    // Create a new post
    async createMockPost(): Promise<Post> {
        const payload: MockPost = generateMockPost();
        const res = await this.client.query(
            'INSERT INTO public.posts (title, description, content, slug, thumbnail, word_count, read_time, user_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [
                payload.title,
                payload.description,
                payload.content,
                payload.slug,
                payload.thumbnail,
                payload.word_count,
                payload.read_time,
                payload.userId,
                payload.isPublished,
            ]
        );
        console.log(res.rows[0]);
        return res.rows[0];
    }

    // Create a new user
    async createMockUser(isAdmin: boolean): Promise<User> {
        const payload: MockUser = generateMockUser(isAdmin);
        const res = await this.client.query(
            'INSERT INTO public.users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                payload.username,
                payload.email,
                payload.password,
                payload.is_admin,
            ]
        );
        return res.rows[0];
    }

    // Delete a post by id
    async deletePostById(id: number): Promise<Post> {
        const res = await this.client.query(
            'DELETE FROM public.posts WHERE id = $1 RETURNING *',
            [id]
        );
        return res.rows[0];
    }

    // Delete posts by slug title
    async deletePostsByTitle(title: string): Promise<Post> {
        const res = await this.client.query(
            'DELETE FROM public.posts WHERE title = $1 RETURNING *',
            [title]
        );
        return res.rows[0];
    }

    // Delete user by username
    async deleteUserByUsername(username: string): Promise<User> {
        const res = await this.client.query(
            'DELETE FROM public.users WHERE username = $1 RETURNING *',
            [username]
        );
        return res.rows[0];
    }
}

export default TestDBClient;
