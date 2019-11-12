/* @flow */

import type { ExpressRequest, ExpressResponse } from './types';

type Middleware = (req : ExpressRequest, res : ExpressResponse, next : Function) => void;

export function sameSiteCookieMiddleware() : Middleware {
    return (req, res, next) => {
        const { cookie } = res;

        const setCookieWithSameSite = function (name, value, opts, ...args) : void {
            opts = opts || {};
            opts.sameSite = opts.sameSite || 'None';
            return cookie.call(this, name, value, opts, ...args);
        };

        // $FlowFixMe
        res.cookie = setCookieWithSameSite;

        next();
    };
}
