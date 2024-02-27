import { describe, expect, it } from 'bun:test';
import app from '../src';

const url: string = process.env.API_URL + '/health';

describe('Health endpoint', () => {
    it('should return 200', async () => {
        const req = new Request(url, {
            method: 'GET',
        });
        const res = await app.fetch(req);
        const responseBody = await res.json();
        expect(res.status).toBe(200);
        expect(responseBody.status).toBe(200);
        expect(responseBody.message).toBe('Healthy');
    });
});
