import { Cookie } from 'elysia';

type MiddlewareFunction = (context: {
    body: unknown;
    query: Record<string, string | undefined>;
    params: Record<never, string>;
    headers: Record<string, string | undefined>;
    cookie: Record<string, Cookie<any>>;
    set: any;
    path: string;
    request: Request;
    store: {};
}) => unknown;

export default MiddlewareFunction;
