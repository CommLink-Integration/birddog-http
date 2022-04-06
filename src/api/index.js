const http = require('http');
const v1 = require('./v1.js');
const v2 = require('./v2.js');
const Visca = require('./visca.js');

const DEBUG = false;

// unsupported response property values are returned as '%!s(<nil>)' by the API. remove these properties
const removeUnsupportedProps = (obj) => {
    return Object.keys(obj)
        .filter((k) => obj[k] !== '%!s(<nil>)')
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
};

// #region HTTP requests
const port = 8080;

function _request(host, resource, method, params) {
    const opts = {
        hostname: host,
        port,
        path: resource,
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // console.log(opts)
    return new Promise((resolve, reject) => {
        // console.log(opts)
        const req = http.request(opts, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            let data;
            res.on('data', (chunk) => {
                if (data) data += chunk;
                else data = chunk;
            });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(
                        new Error(
                            `Bad API request to http://${host}:${port}${resource}, HTTP response code: ${res.statusCode}`
                        )
                    );
                } else resolve(data ? data.trim() : data);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        if (params) req.write(JSON.stringify(params));
        req.end();
    });
}

/**
 * A wrapper around _request() for GET requests with no body parameters
 * @param {string} endpoint - the url endpoint to query
 * @returns {Object|String} either a parsed JSON response object or a string
 */
async function get(host, endpoint) {
    const response = await _request(host, endpoint, 'GET');

    // some responses are just a string, like /hostname
    if (response[0] === '{' && response[response.length - 1] === '}')
        return removeUnsupportedProps(JSON.parse(response));
    else return response;
}

/**
 * A wrapper around _request() for POST requests
 * @param {string} endpoint - the url endpoint to query
 * @param {object} params - the query paramaters to send with the POST
 * @returns {Object|String} either a parsed JSON response object or a string
 */
async function post(host, endpoint, params) {
    const response = await _request(host, endpoint, 'POST', params);

    // some responses are just a string, like /hostname
    if (response[0] === '{' && response[response.length - 1] === '}')
        return removeUnsupportedProps(JSON.parse(response));
    else return response;
}
// #endregion HTTP requests

async function discover(host) {
    try {
        const model = await _request(host, v2.version, 'GET');
        if (DEBUG) console.log('Found model:', model);
        return model;
    } catch (e) {
        console.error(e);
    }
}

module.exports = { get, post, discover, v1, v2, Visca };