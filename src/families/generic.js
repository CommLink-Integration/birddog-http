const { discover } = require('../api/index.js');

const Models = require('../models/index.js');

/**
 * A class that returns a specific BirdDog model based on the response from http://${host}:8080/version
 * @param {string} host - The IP address of the BirdDog unit to connect to
 * @param {string} [model] - Optionally set the device type for older firmware versions that don't support v2.0 API. There is limited support for these devices and no guarantee is made about any command working correctly
 * @param {boolean} [debug] - If the device should print debug output to the console, default is false
 */
 module.exports = class GenericBirdDog {
    constructor({ host, model = undefined, debug = false }) {
        this._debug = debug;
        return (async () => {
            if (model) {
                if (Models.names.includes(model)) {
                    this.model = model;
                    if (this._debug) console.log('Setting model to:', model);
                } else console.error(`Invalid model selected in constructor: ${model}`);
            } else {
                try {
                    this.model = await discover(host);
                } catch (e) {
                    console.error('Problem determining GenericBirdDog model', e);
                }
            }
            switch (this.model) {
                case 'P100':
                case 'BirdDog P100':
                    return new Models.P100({ host, version: this.model, debug });
                case 'PF120':
                    return new Models.PF120({ host, version: this.model, debug });
                case 'P200':
                case 'BirdDog P200A4_A5':
                    return new Models.P200({ host, version: this.model, debug });
                case 'P400':
                    return new Models.P400({ host, version: this.model, debug });
                case 'P4K':
                    return new Models.P4K({ host, version: this.model, debug });
                case 'A200':
                    return new Models.A200({ host, version: this.model, debug });
                case 'A300':
                    return new Models.A300({ host, version: this.model, debug });
                case 'WPEncode':
                    return new Models.WPEncode({ host, version: this.model, debug });
                case 'WPDecode':
                    return new Models.WPDecode({ host, version: this.model, debug });
                case 'Studio':
                    return new Models.Studio({ host, version: this.model, debug });
                case 'Mini':
                    return new Models.Mini({ host, version: this.model, debug });
                case 'FlexIn':
                case 'BirdDog Flexin':
                    return new Models.FlexIn({ host, version: this.model, debug });
                case 'FlexOut':
                case 'BirdDog Flexout':
                    return new Models.FlexOut({ host, version: this.model, debug });
                case 'HDMISDI4K':
                    return new Models.HDMISDI4K({ host, version: this.model, debug });
                case 'Quad4K':
                    return new Models.Quad4K({ host, version: this.model, debug });
                default:
                    throw Error(
                        `Could not determine BirdDog model. Ensure the device firmware supports the v2.0 API. For limited support set model type in constructor`
                    );
            }
        })();
    }
}
