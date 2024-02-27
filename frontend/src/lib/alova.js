import { createAlova } from 'alova';
import ReactHook from 'alova/react';
import GlobalFetch from 'alova/GlobalFetch';

export const alovaInstance = createAlova({
    baseURL: process.env.API_URL,
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    // responded: (response) => response.json(),
});
