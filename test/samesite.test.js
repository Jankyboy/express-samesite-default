/* @flow */

import { sameSiteCookieMiddleware } from '../src';

const USERAGENT = {
    CHROME:     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    OLD_CHROME:   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3904.108 Safari/537.36',
    CHROMIUM:   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/73.0.3683.86 Chrome/73.0.3683.86 Safari/537.36',
    SAFARI:     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15'
};

test('Should add SameSite to a cookie without it set', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.CHROME;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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

    if (!opts.secure) {
        throw new Error(`Expected cookie to be in secure mode`);
    }
});

test('Should add SameSite to a cookie without it set when browser is Chromium', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.CHROMIUM;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.CHROME;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.CHROME;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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

test('Should not add SameSite to a cookie when the browser is not chrome or chromium', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.SAFARI;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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

    const { value, opts = {} } = cookies.foo;

    if (value !== 'bar') {
        throw new Error(`Expected cookie value to be 'bar', got '${ value }'`);
    }

    if (opts.sameSite) {
        throw new Error(`Expected sameSite cookie opt to be blank, got '${ opts.sameSite }'`);
    }
});

test('Should not add SameSite to a cookie when the browser is an older chrome version', () => {

    const middleware = sameSiteCookieMiddleware();

    let nextCalled = false;
    const cookies = {};
    const req = {
        get: (key) => {
            if (key.toLowerCase() === 'user-agent') {
                return USERAGENT.OLD_CHROME;
            }

            throw new Error(`Can not get header: ${ key }`);
        }
    };

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

    const { value, opts = {} } = cookies.foo;

    if (value !== 'bar') {
        throw new Error(`Expected cookie value to be 'bar', got '${ value }'`);
    }

    if (opts.sameSite) {
        throw new Error(`Expected sameSite cookie opt to be blank, got '${ opts.sameSite }'`);
    }
});
