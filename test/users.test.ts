import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import app from '../src';
import TestDBClient from '~utils/TestDBClient';
import jwt from 'jsonwebtoken';
import { generateMockUserAPIPayload } from '~utils/mockData';

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

const url: string = process.env.API_URL + '/user';

const adminToken: string = generateJWT(1, 'test_admin', 'admin');
const defaultUserToken: string = generateJWT(2, 'test_user', 'user');

// Database client
const dbClient = new TestDBClient();
await dbClient.connect();

describe('User endpoint', () => {
    describe('GET USERS', () => {
        let userCount: number = 0;
        let newUser: any = {};

        afterAll(async () => {
            await dbClient.deleteUserByUsername(newUser.username);
        });

        it('Get all current users. Status: 200', async () => {
            const req = new Request(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            userCount = responseBody.length;
            expect(res.status).toEqual(200);
        });

        it('Get all current users. Status: 200. Check if the current users count has increased after creating a new user', async () => {
            newUser = await dbClient.createMockUser(false);
            const req = new Request(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.length).toEqual(userCount + 1);
        });
    });

    describe('GET USER BY ID', () => {
        let user: any = {};

        afterAll(async () => {
            await dbClient.deleteUserByUsername(user.username);
        });

        beforeAll(async () => {
            user = await dbClient.createMockUser(false);
        });

        it('Get a user by ID. Status: 200', async () => {
            const req = new Request(url + `/${user.id}`, {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.username).toEqual(user.username);
            expect(responseBody.email).toEqual(user.email);
        });

        it('Get a non-existent user by ID. Status: 404', async () => {
            const req = new Request(url + '/0', {
                method: 'GET',
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            console.log(responseBody);
            expect(res.status).toEqual(404);
            expect(responseBody.message).toEqual('User not found');
        });
    });

    describe('CREATE USER', () => {
        let newUser: any = {};

        afterAll(async () => {
            await dbClient.deleteUserByUsername(newUser.username);
        });

        beforeAll(async () => {
            newUser = generateMockUserAPIPayload();
        });

        it('Create a new user. Status: 201', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(newUser),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(201);
            expect(responseBody.status).toEqual(201);
            expect(responseBody.message).toEqual('User created successfully');
            expect(responseBody.data.username).toEqual(newUser.username);
            expect(responseBody.data.email).toEqual(newUser.email);
            expect(responseBody.data.is_admin).toEqual(newUser.isAdmin);
        });

        it('Create a user with existing username and email. Status: 409', async () => {
            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(newUser),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(409);
            expect(responseBody.message).toEqual(
                'Username or email already exists'
            );
        });
    });

    describe('DELETE USER', () => {
        let newUser: any = {};

        beforeAll(async () => {
            newUser = await dbClient.createMockUser(false);
        });

        it('Delete a user by ID. Status: 200', async () => {
            const req = new Request(url + `/${newUser.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.data.username).toEqual(newUser.username);
            expect(responseBody.data.email).toEqual(newUser.email);
            expect(responseBody.data.is_admin).toEqual(newUser.is_admin);
            expect(responseBody.message).toEqual('User deleted successfully');
        });

        it('Delete a non-existent user by ID. Status: 404', async () => {
            const req = new Request(url + '/0', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toEqual(404);
            expect(responseBody.message).toEqual('User not found');
        });
    });
});
