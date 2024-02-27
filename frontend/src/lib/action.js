'use server';

import { revalidatePath } from 'next/cache';
import { pvSchema, invalidMessages } from './password';
import { cookies } from 'next/headers';
import { alovaInstance } from './alova';

const handleRequest = async (method, url, data, accessToken, refreshToken) => {
    try {
        const res = await alovaInstance[method](url, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                // Set refresh token to cookies if it exists
                Cookie: `refresh_token=${refreshToken}`,
            },
        });
        return res;
    } catch (error) {
        console.error(error);
        return { error, result: null };
    }
};

export const addPost = async (previousState, formData) => {
    const { title, description, content, userId, thumbnail, isPublished } =
        Object.fromEntries(formData);
    console.log(formData);
    if (!title || !description || !content || !userId || !thumbnail)
        return { error: 'Please fill out all fields', result: null };

    const user_id = parseInt(userId);
    const accessToken = cookies().get('access_token')?.value;
    const refreshToken = cookies().get('refresh_token')?.value;

    const res = await handleRequest(
        'Post',
        '/post',
        {
            title,
            description,
            content,
            userId: user_id,
            thumbnail,
            isPublished: isPublished === 'on',
        },
        accessToken,
        refreshToken
    );

    if (res.status !== 201)
        return { error: 'Something went wrong', result: null };
    const data = await res.json();
    revalidatePath('/admin');
    return { error: null, result: data };
};

export const addUser = async (previousState, formData) => {
    const { username, password, email, avatar, isAdmin } = formData;
    if (!username || !password || !email || isAdmin === undefined)
        return { error: 'Please fill out all fields', result: null };

    const isPasswordValid = await pvSchema.validate(password);
    if (!isPasswordValid) return { error: invalidMessages, result: null };

    const accessToken = cookies().get('access_token')?.value;
    const res = await handleRequest(
        'Post',
        '/user',
        {
            username,
            password,
            email,
            avatar: avatar || '',
            isAdmin: isAdmin === 'true',
        },
        accessToken
    );

    if (res.status !== 201)
        return { error: 'Something went wrong', result: null };

    revalidatePath('/admin');
    return { error: null, result: res };
};

export const deletePost = async (formData) => {
    const { id } = formData;
    if (!id) return null;

    try {
        const accessToken = cookies().get('access_token').value;
        const refreshToken = cookies().get('refresh_token').value;
        const res = await handleRequest(
            'Delete',
            `/post/${id}`,
            {},
            accessToken,
            refreshToken
        );

        if (res.status !== 200)
            return { error: 'Something went wrong', result: null };

        revalidatePath('/blog');
        const body = await res.json();
        return { error: null, result: body };
    } catch (error) {
        console.error(error);
        return { error: error, result: null };
    }
};

export const deleteUser = async (formData) => {
    const { id } = formData;
    if (!id) return null;

    try {
        const accessToken = cookies().get('access_token')?.value;
        const refreshToken = cookies().get('refresh_token')?.value;
        const res = await handleRequest(
            'Delete',
            `/user/${id}`,
            {},
            accessToken,
            refreshToken
        );

        if (res.status !== 200)
            return { error: 'Something went wrong', result: null };

        revalidatePath('/admin');
        const data = await res.json();
        return { error: null, result: data };
    } catch (error) {
        console.error(error);
        return { error: error, result: null };
    }
};

export const register = async (data) => {
    const { username, email, password } = data;
    if (!username || !email || !password)
        return { status: 'error', message: 'Please fill out all fields' };
    const isPasswordValid = await pvSchema.validate(password);
    if (!isPasswordValid)
        return { status: 'error', message: 'Invalid password' };

    try {
        const res = await alovaInstance
            .Post(
                '/auth/register',
                { username, email, password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .send();
        if (res.status === 201) {
            const accessToken = res.headers.get('Authorization').split(' ')[1];
            const refreshToken = res.headers
                .get('Set-Cookie')
                .split('=')[1]
                .split(';')[0];
            const body = await res.json();
            cookies().set('access_token', accessToken);
            cookies().set('refresh_token', refreshToken);
            cookies().set(
                'role',
                body.data.isAdmin === true ? 'admin' : 'user'
            );
            return { status: res.status, message: body.message };
        }
    } catch (error) {
        console.error(error);
        if (error.type === 'CredentialsSignup')
            return { status: 'error', message: 'Invalid username or email' };
        throw error;
    }
};

export const login = async (data) => {
    const { username, password } = data;
    if (!username || !password)
        return { status: 'error', message: 'Please fill out all fields' };

    const isPasswordValid = await pvSchema.validate(password);
    if (!isPasswordValid)
        return { status: 'error', message: 'Invalid password' };

    try {
        const res = await alovaInstance
            .Post(
                '/auth/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .send();
        if (res.status === 200) {
            // Access token from header of response
            const accessToken = res.headers.get('Authorization').split(' ')[1];
            // Refresh token from cookie of response
            const refreshToken = res.headers
                .get('Set-Cookie')
                .split('=')[1]
                .split(';')[0];
            const body = await res.json();
            cookies().set('access_token', accessToken);
            cookies().set('refresh_token', refreshToken);
            cookies().set(
                'role',
                body.data.isAdmin === true ? 'admin' : 'user'
            );
            return { status: res.status, message: body.message };
        }
    } catch (error) {
        console.error(error);
        if (error.type === 'CredentialsSignin')
            return { status: 'error', message: 'Invalid username or password' };
        throw error;
    }
};

export const logout = async () => {
    try {
        cookies().delete('access_token');
        cookies().delete('refresh_token');
        cookies().delete('role');
        return { status: 'success', message: 'Logout successfully' };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Something went wrong' };
    }
};
