const EncodeDecode = require('../families/bidirection.js');

module.exports = class Quad4K extends EncodeDecode {
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
