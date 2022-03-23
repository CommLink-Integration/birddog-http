const { get, post, v2: endpoints } = require('../api/index.js');
const BaseModel = require('./base.js');

/**
 * Implements the portions of the API that all decoders should respond to
 */
module.exports = class Decoder extends BaseModel {
    constructor({ host, debug = false }) {
        super({ host, debug });
        this._debug = debug;
        this.host = host;
        this.model = this.constructor.name; // gets the child class name, i.e. WPDecode, FlexOut, etc.
    }

    // static deviceList = ['WPDecode', 'FlexOut', '4KHDMISDI'];
    static get family() {
        return 'decoder';
    }

    async getDecodeStatus() {
        return await get(this.host, endpoints.decodeStatus);
    }

    async getDecodeSettings() {
        return await get(this.host, endpoints.decodeSetup);
    }

    async setDecodeSettings(params) {
        return await post(this.host, endpoints.decodeSetup, params);
    }

    async getDecodeTransport() {
        return await get(this.host, endpoints.decodeTransport);
    }

    async setDecodeTransport(params) {
        return await post(this.host, endpoints.decodeTransport, params);
    }
}
