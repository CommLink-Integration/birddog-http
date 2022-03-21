const Decoder = require('../families/decoder.js');

module.exports = class FlexOut extends Decoder {
    constructor({ host, version, debug = false }) {
        super({ host, debug });
        this.version = version;
    }

    get family() {
        return super.constructor.family;
    }

    async throwUnsupported(fname) {
        throw Error(`${fname}() not supported on ${this.version}`);
    }
}
