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

/**
 * TestDBClient class
 *
 * This class is used to interact with the test database
 *
 * @class
 * @public
 * @property {Client} client - The database client
 * @method connect - Connect to the database
 * @method disconnect - Disconnect from the database
 * @method createMockPost - Create a new post
 * @method createMockUser - Create a new user
 * @method deletePostById - Delete a post by id
 * @method deletePostsByTitle - Delete posts by slug title
 * @method deleteUserByUsername - Delete user by username
 */
class TestDBClient {
    client: Client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5423'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    /**
     * connect method
     *
     * This method connects to the database
     */
    async connect() {
        await this.client.connect();
    }

    /**
     * disconnect method
     *
     * This method disconnects from the database
     */
    async disconnect() {
        await this.client.end();
    }

    // async query(query: string, values: any) {
    //     return await this.client.query(query, values);
    // }

    /**
     * createMockPost method
     *
     * This method creates a new post
     *
     * @returns {Promise<Post>} - A promise that resolves to a post object
     * @throws {Error} - Throws an error if an error occurs
     */
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
        // console.log(res.rows[0]);
        return res.rows[0];
    }

    /**
     * createMockUser method
     *
     * This method creates a new user
     *
     * @param {boolean} isAdmin - A boolean value to determine if the user is an admin
     * @returns {Promise<User>} - A promise that resolves to a user object
     * @throws {Error} - Throws an error if an error occurs
     */
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

    /**
     * deletePostById method
     *
     * This method deletes a post by id
     *
     * @param {number} id - The id of the post to delete
     * @returns {Promise<Post>} - A promise that resolves to a post object
     * @throws {Error} - Throws an error if an error occurs
     */
    async deletePostById(id: number): Promise<Post> {
        const res = await this.client.query(
            'DELETE FROM public.posts WHERE id = $1 RETURNING *',
            [id]
        );
        return res.rows[0];
    }

    /**
     * deletePostsByTitle method
     *
     * This method deletes posts by title
     *
     * @param {string} title - The title of the post to delete
     * @returns {Promise<Post>} - A promise that resolves to a post object
     * @throws {Error} - Throws an error if an error occurs
     */
    async deletePostsByTitle(title: string): Promise<Post> {
        const res = await this.client.query(
            'DELETE FROM public.posts WHERE title = $1 RETURNING *',
            [title]
        );
        return res.rows[0];
    }

    /**
     * deleteUserByUsername method
     *
     * This method deletes a user by username
     *
     * @param {string} username - The username of the user to delete
     * @returns {Promise<User>} - A promise that resolves to a user object
     * @throws {Error} - Throws an error if an error occurs
     */
    async deleteUserByUsername(username: string): Promise<User> {
        const res = await this.client.query(
            'DELETE FROM public.users WHERE username = $1 RETURNING *',
            [username]
        );
        return res.rows[0];
    }
}

export default TestDBClient;
