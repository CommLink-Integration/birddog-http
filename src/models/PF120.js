const Camera = require('../families/camera.js');

module.exports = class PF120 extends Camera {
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

    async getAdvancedSettings() {
        await this.throwUnsupported('getAdvancedSettings');
    }

    async setAdvancedSettings() {
        await this.throwUnsupported('setAdvancedSettings');
    }

    async getExternalSettings() {
        await this.throwUnsupported('getExternalSettings');
    }

    async setExternalSettings() {
        await this.throwUnsupported('setExternalSettings');
    }

    async getDetailSetup() {
        await this.throwUnsupported('getDetailSetup');
    }

    async setDetailSetup() {
        await this.throwUnsupported('setDetailSetup');
    }

    async getGamma() {
        await this.throwUnsupported('getGamma');
    }

    async setGamma() {
        await this.throwUnsupported('setGamma');
    }
}
