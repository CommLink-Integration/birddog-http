const { get, post, endpoints } = require('../api.js');
const Decoder = require('./decoder.js');

/**
 * Implements the portions of the API that all encode/decode devices should respond to
 */
module.exports = class EncodeDecode extends Decoder {
    constructor({ host, debug = false }) {
        super({ host, debug }); // This gets Decoder and Base functionality
        this._debug = debug;
        this.host = host;
        this.model = this.constructor.name; // gets the child class name, i.e. Mini, Studio, etc.
    }

    // static deviceList = ['Mini', 'Studio', 'Quad'];
    static get family() {
        return 'codec';
    }

    async getOperationMode() {
        return await get(this.host, endpoints.operationMode);
    }

    /**
     * Sets the operation mode to encode or decoder
     * @param {string} mode - Can be 'encode' or 'decode'
     * @returns
     */
    async setOperationMode(mode) {
        return await post(this.host, endpoints.operationMode, mode);
    }

    // Easier to replicate Encoder functions than to extend two classes
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
