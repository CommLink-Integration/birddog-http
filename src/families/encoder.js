const { get, post, endpoints } = require('../api.js');
const BaseModel = require('./base.js');
/**
 * Implements the portions of the API that all encoders should respond to
 */
module.exports = class Encoder extends BaseModel {
    constructor({ host, debug = false }) {
        super({ host, debug });
        this._debug = debug;
        this.host = host;
        this.model = this.constructor.name; // gets the child class name, i.e. WPEncode, FlexIn, etc.
    }

    // static deviceList = ['WPEncode', 'FlexIn', '4KHDMISDI'];
    static get family() {
        return 'encoder';
    }

    async getEncodeSettings() {
        return await get(this.host, endpoints.encodeSetup);
    }

    async setEncodeSettings(params) {
        return await post(this.host, endpoints.encodeSetup, params);
    }

    async getEncodeTransport() {
        return await get(this.host, endpoints.encodeTransport);
    }

    async setEncodeTransport(params) {
        return await post(this.host, endpoints.encodeTransport, params);
    }
}
