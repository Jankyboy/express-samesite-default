/* @flow */

import { sameSiteCookieMiddleware } from '../src';

test('Should add SameSite to a cookie without it set', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {};

    const res = {
        cookie: (name, value, opts) => {
            cookies[name] = { value, opts };
        }
    };

    const next = () => {
        nextCalled = true;
    };

    // $FlowFixMe
    middleware(req, res, next);

    if (!nextCalled) {
        throw new Error(`Expected next to be called`);
    }

    res.cookie('foo', 'bar');

    const { value, opts } = cookies.foo;

    if (value !== 'bar') {
        throw new Error(`Expected cookie value to be 'bar', got '${ value }'`);
    }

    if (!opts) {
        throw new Error(`Expected opts to be set with cookie`);
    }

    if (opts.sameSite !== 'None') {
        throw new Error(`Expected sameSite cookiue opt to be 'None', got '${ opts.sameSite }'`);
    }
});

test('Should add SameSite to a cookie with opts passed and without it set', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {};

    const res = {
        cookie: (name, value, opts) => {
            cookies[name] = { value, opts };
        }
    };

    const next = () => {
        nextCalled = true;
    };

    // $FlowFixMe
    middleware(req, res, next);

    if (!nextCalled) {
        throw new Error(`Expected next to be called`);
    }

    const options : Object = {
        expires: 12345
    };

    res.cookie('foo', 'bar', options);

    const { value, opts } = cookies.foo;

    if (value !== 'bar') {
        throw new Error(`Expected cookie value to be 'bar', got '${ value }'`);
    }

    if (!opts) {
        throw new Error(`Expected opts to be set with cookie`);
    }

    if (opts.sameSite !== 'None') {
        throw new Error(`Expected sameSite cookiue opt to be 'None', got '${ opts.sameSite }'`);
    }

    if (opts.expires !== 12345) {
        throw new Error(`Expected expires to be set`);
    }
});

test('Should not add SameSite to a cookie with it already set', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {};

    const res = {
        cookie: (name, value, opts) => {
            cookies[name] = { value, opts };
        }
    };

    const next = () => {
        nextCalled = true;
    };

    // $FlowFixMe
    middleware(req, res, next);

    if (!nextCalled) {
        throw new Error(`Expected next to be called`);
    }

    res.cookie('foo', 'bar', {
        sameSite: 'Strict'
    });

    const { value, opts } = cookies.foo;

    if (value !== 'bar') {
        throw new Error(`Expected cookie value to be 'bar', got '${ value }'`);
    }

    if (!opts) {
        throw new Error(`Expected opts to be set with cookie`);
    }

    if (opts.sameSite !== 'Strict') {
        throw new Error(`Expected sameSite cookiue opt to be 'Strict', got '${ opts.sameSite }'`);
    }
});
