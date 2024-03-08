import { afterAll, beforeAll, describe, expect, it, jest } from 'bun:test';
import jwt from 'jsonwebtoken';
import app from '../src';
import { generateMockAuthAPIPayload } from '~utils/mockData';
import { loginSuccess, userCreated } from '~messages/success';
import TestDBClient from '~utils/TestDBClient';
import {
    passwordIncorrect,
    userNotFound,
    userOrEmailExists,
} from '~messages/failure';

const url: string = process.env.API_URL + '/auth';

const dbClient = new TestDBClient();
await dbClient.connect();

describe('Auth endpoint', () => {
    let testUser: any = {};
    let testRefreshToken: string = '';

    beforeAll(async () => {
        testUser = generateMockAuthAPIPayload();
    });

    afterAll(async () => {
        await dbClient.deleteUserByUsername(testUser.username);
        await dbClient.disconnect();
    });

    describe('REGISTER', () => {
        it('register with valid credentials. Status: 201', async () => {
            const req = new Request(url + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testUser),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            // console.log(responseBody);
            expect(res.status).toBe(201);
            expect(responseBody.status).toBe(201);
            expect(responseBody.message).toBe(userCreated);
        });
        it('register with existing username. Status: 409', async () => {
            const req = new Request(url + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testUser),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(409);
            expect(responseBody.status).toBe(409);
            expect(responseBody.message).toBe(userOrEmailExists);
        });
    });

    describe('LOGIN', () => {
        it('login with correct credentials. Status: 200', async () => {
            const req = new Request(url + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: testUser.username,
                    password: testUser.password,
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(200);
            expect(responseBody.status).toBe(200);
            expect(responseBody.message).toBe(loginSuccess);
            // Set the refresh token for later use
            testRefreshToken =
                res.headers.get('set-cookie')?.split('=')[1].split(';')[0] ||
                '';
        });
        it('login with incorrect password. Status: 401', async () => {
            const req = new Request(url + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: testUser.username,
                    password: 'wrong_password',
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(401);
            expect(responseBody.status).toBe(401);
            expect(responseBody.message).toBe(passwordIncorrect);
        });
        it('login with non-existent username. Status: 404', async () => {
            const req = new Request(url + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'wrong_username',
                    password: testUser.password,
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(404);
            expect(responseBody.status).toBe(404);
            expect(responseBody.message).toBe(userNotFound);
        });
    });
    describe('TOKENS', () => {
        it('Refresh token. Status: 200', async () => {
            const req = new Request(url + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: testRefreshToken,
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(200);
            expect(responseBody.status).toBe(200);
            expect(responseBody.message).toBe('Token refreshed');
        });

        it('Refresh token with invalid token. Status: 404', async () => {
            const req = new Request(url + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: 'invalid_token',
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(404);
            expect(responseBody.status).toBe(404);
            expect(responseBody.message).toBe('Invalid token');
        });

        it('Refresh token with valid token but non-existent in DB. Status: 404', async () => {
            const req = new Request(url + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: jwt.sign(
                        { username: 'non_existent_user', role: 'user' },
                        process.env.JWT_REFRESH || 'refresh'
                    ),
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(404);
            expect(responseBody.status).toBe(404);
            expect(responseBody.message).toBe('Invalid token');
        });

        it('Revoke token. Status: 200', async () => {
            const req = new Request(url + '/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: testRefreshToken,
                }),
            });
            console.log(
                jwt.verify(
                    testRefreshToken,
                    process.env.JWT_REFRESH || 'refresh'
                )
            );
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(200);
            expect(responseBody.status).toBe(200);
            expect(responseBody.message).toBe('Token revoked');
        });

        it('Revoke token with invalid token. Status: 404', async () => {
            const req = new Request(url + '/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: 'invalid_token',
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(404);
            expect(responseBody.status).toBe(404);
            expect(responseBody.message).toBe('Invalid token');
        });

        it('Revoke token with valid token but non-existent in DB. Status: 404', async () => {
            const req = new Request(url + '/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: jwt.sign(
                        { username: 'non_existent_user', role: 'user' },
                        process.env.JWT_REFRESH || 'refresh'
                    ),
                }),
            });
            const res = await app.fetch(req);
            const responseBody = await res.json();
            expect(res.status).toBe(404);
            expect(responseBody.status).toBe(404);
            expect(responseBody.message).toBe('Invalid token');
        });
    });
});
