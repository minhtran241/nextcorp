import APIError from '~errors/APIError';
import MiddlewareFunction from '~types/MiddlewareFunction';

/**
 * isAuthenticated middleware
 *
 * This middleware checks if a user is authenticated
 *
 * @param {Object} - An object containing the request context
 * @returns {Promise} - A promise that resolves to the next middleware
 * @throws {APIError} - Throws an APIError if an error occurs
 */
export const isAuthenticated: MiddlewareFunction = async (context) => {
    const {
        bearer,
        set,
        cookie: { refresh_token },
        jwt,
    } = context;
    // Get access token from header, refresh token from cookie
    if (!bearer && !refresh_token) {
        set.status = 401;
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`;

        throw new APIError(401, 'Unauthorized');
    }

    const profile = await jwt.verify(bearer);
    if (!profile) {
        // Check if refresh token is valid
        const rprofile = await jwt.verify(refresh_token);
        if (!rprofile) {
            set.status = 401;
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`;

            throw new APIError(401, 'Unauthorized');
        }
        // else {
        //     // Generate new access token
        //     const newAccessToken = await jwt.sign(rprofile);
        //     set.headers['Authorization'] = `Bearer ${newAccessToken}`;
        //     set.cookie['refresh_token'] = refresh_token;
        // }
    }
};

/**
 * isAdmin middleware
 *
 * This middleware checks if a user is an admin
 *
 * @param {Object} - An object containing the request context
 * @returns {Promise} - A promise that resolves to the next middleware
 * @throws {APIError} - Throws an APIError if an error occurs
 */
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
