import APIError from '~errors/APIError';
import MiddlewareFunction from '~types/MiddlewareFunction';

export const isAuthenticated: MiddlewareFunction = async (context) => {
    const {
        bearer,
        set,
        cookie: { access_token },
        jwt,
    } = context;
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

export const isAdmin: MiddlewareFunction = async (context) => {
    const {
        bearer,
        set,
        cookie: { access_token },
        jwt,
    } = context;
    const token = bearer || access_token;
    const profile = await jwt.verify(token);
    if (profile.role !== 'admin') {
        set.status = 403;
        throw new APIError(403, 'Forbidden');
    }
};
