/* @flow */

import bowser from 'bowser';

import type { ExpressRequest, ExpressResponse } from './types';

type Middleware = (req : ExpressRequest, res : ExpressResponse, next : Function) => void;

function isChrome67Plus(req : ExpressRequest) : boolean {
    try {
        const browser = bowser.getParser(req.get('user-agent') || '');
        return browser.satisfies({ chrome: '>=67', chromium: '>=67' });
    } catch (err) {
        return false;
    }
}

export function sameSiteCookieMiddleware() : Middleware {
    return (req, res, next) => {
        if (!isChrome67Plus(req)) {
            return next();
        }

        const { cookie } = res;

        const setCookieWithSameSite = function (name, value, opts, ...args) : void {
            opts = opts || {};
            opts.sameSite = opts.sameSite || 'None';
            opts.secure = true;
            return cookie.call(this, name, value, opts, ...args);
        };

        // $FlowFixMe
        res.cookie = setCookieWithSameSite;

        next();
    };
}
