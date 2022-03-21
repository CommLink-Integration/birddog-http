const Encoder = require('../families/encoder.js');

module.exports = class FlexIn extends Encoder {
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
