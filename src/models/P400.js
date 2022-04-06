const { get, post, v2: endpoints } = require('../api/index.js');
const Camera = require('../families/camera.js');

module.exports = class P400 extends Camera {
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

    async getVideoOutput() {
        return { videoOutput: await get(this.host, endpoints.videoOutputInterface) };
    }

    async setVideoOutput(output) {
        return { videoOutput: await post(this.host, endpoints.videoOutputInterface, output) };
    }
}
