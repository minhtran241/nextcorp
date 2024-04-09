/**
 * APIError class
 *
 * This class is used to handle API errors
 *
 * @param {number} statusCode - The status code of the error
 * @param {string} message - The error message
 */
export default class APIError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}
