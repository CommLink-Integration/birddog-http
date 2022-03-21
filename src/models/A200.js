const Camera = require('../families/camera.js');

module.exports = class A200 extends Camera {
    constructor({ host, version, debug = false }) {
        super({ host, debug });
        this.version = version; // for special cases between hardware versions of the A200
    }

    get family() {
        return super.constructor.family;
    }

    // catch the standard camera family calls that have special cases for the A200 and let everything else
    // pass straight through to the Camera class

    async throwUnsupported(fname) {
        throw Error(`${fname}() not supported on ${this.version}`);
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
