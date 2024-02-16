import APIError from '~errors/APIError';

export const isAuthenticated = async ({
    bearer,
    set,
    cookie: { access_token },
    jwt,
}: {
    bearer: any;
    set: any;
    cookie: { access_token: string };
    jwt: any;
}): Promise<void> => {
    if (!bearer && !access_token) {
        set.status = 401;
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`;

        throw new APIError(401, 'Unauthorized');
    }

    const token = bearer || access_token;
    const profile = await jwt.verify(token);
    if (!profile) {
        set.status = 401;
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`;

        throw new APIError(401, 'Unauthorized');
    }
};

export const isAdmin = async ({
    bearer,
    set,
    cookie: { access_token },
    jwt,
}: {
    bearer: string;
    set: any;
    cookie: { access_token: string };
    jwt: any;
}): Promise<void> => {
    const token = bearer || access_token;
    const profile = await jwt.verify(token);
    if (profile.role !== 'admin') {
        set.status = 403;
        throw new APIError(403, 'Forbidden');
    }
};
