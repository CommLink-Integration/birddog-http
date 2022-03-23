const net = require('net');
const GenericBirdDog = require('./families/generic.js');

/**
 * In general, responses are passed straight through from the device. i.e. the property names are not changed
 * from what the device expects. There are some basic formatting fixes like extra " characters removed from
 * strings, and raw string responses shoved into an object before being returned. This does mean, however, that
 * most received property values are string types and must be converted to Numbers if necessary
 * @param {string} host - The IP address of the BirdDog unit to connect to
 * @param {string} [model] - Optionally set the device type for older firmware versions that don't support v2.0 API. There is limited support for these devices and no guarantee is made about any command working correctly
 * @param {boolean} [debug] - If the device should print debug output to the console, default is false
 */
class BirdDog {
    constructor({ host, model = undefined, debug = false }) {
        if (typeof host !== 'string' || !net.isIPv4(host)) {
            console.error('Bad host assignment');
            throw Error('Bad host assignment');
        }
        this._debug = debug;
        this.host = host;

        return (async () => {
            try {
                return new GenericBirdDog({ host, model, debug });
                // console.log(this.model);
            } catch (err) {
                console.error(err);
            }
        })();
    }
}

const { v1 } = require('./api/index.js');

module.exports = { BirdDog, v1 };
