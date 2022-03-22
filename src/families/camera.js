const { get, post, endpoints } = require('../api.js');
const Encoder = require('./encoder.js');
const { truncate } = require('../helpers.js');
const dgram = require('dgram');
const { Buffer } = require('buffer');

const viscaPort = 52381;

const viscaCommands = {
    pantilt: {
        header: (speed) => [0x81, 0x01, 0x06, 0x01, speed.pan, speed.tilt],
        upleft: [0x01, 0x01, 0xFF],
        upright: [0x02, 0x01, 0xFF],
        downleft: [0x01, 0x02, 0xFF],
        downright: [0x02, 0x02, 0xFF],
        up: [0x03, 0x01, 0xFF],
        down: [0x03, 0x02, 0xFF],
        left: [0x01, 0x03, 0xFF],
        right: [0x02, 0x03, 0xFF],
        stop: [0x03, 0x03, 0xFF]
    },
    zoom: {
        header: [0x81, 0x01, 0x04, 0x07],
        stop: [0x00, 0xFF],
        in: (speed) => [0x20+speed, 0xFF],
        out: (speed) => [0x30+speed, 0xFF],
    }

}

/**
 * Implements the portions of the API that all cameras should respond to
 */
module.exports = class Camera extends Encoder {
    constructor({ host, debug = false }) {
        super({ host, debug });
        this._debug = debug;
        this.host = host;
        this.viscaSock = dgram.createSocket('udp4');
        this.model = this.constructor.name; // gets the child class name, i.e. P100, P200, PF120, etc.
    }

    // static deviceList = ['P100', 'PF120', 'P200', 'P400', 'P4K', 'A200', 'A300'];
    static get family() {
        return 'camera';
    }

    /**
     * Gets exposure settings, possible property values can be found at https://bird-dog.tv/SW/API/index.html#api-EXPOSURE-birddogexpsetupGet
     * @returns
     */
    async getExposure() {
        return await get(this.host, endpoints.exposure);
    }

    /**
     * Sets exposure settings, possible property values can be found at https://bird-dog.tv/SW/API/index.html#api-EXPOSURE-birddogexpsetupPost
     * @param {object} params - the exposure settings
     * @returns
     */
    async setExposure(params) {
        // const params = {};
        return await post(this.host, endpoints.exposure, params);
    }

    /**
     * Gets white balance settings, possible property values can be found at https://bird-dog.tv/SW/API/index.html#api-EXPOSURE-birddogexpsetupGet
     * @returns
     */
    async getWhiteBalance() {
        return await get(this.host, endpoints.whiteBalance);
    }

    /**
     * Sets white balance settings, possible property values can be found at https://bird-dog.tv/SW/API/index.html#api-EXPOSURE-birddogexpsetupGet
     * @returns
     */
    async setWhiteBalance(params) {
        // const params = {};
        return await post(this.host, endpoints.whiteBalance, params);
    }

    async getPictureSetup() {
        return await get(this.host, endpoints.pictureSetup);
    }

    async setPictureSetup(params) {
        // const params = {};
        return await post(this.host, endpoints.pictureSetup, params);
    }

    async getColorMatrix() {
        return await get(this.host, endpoints.colorMatrix);
    }

    async setColorMatrix(params) {
        // const params = {};
        return await post(this.host, endpoints.colorMatrix, params);
    }

    async getAdvancedSettings() {
        return await get(this.host, endpoints.advancedSettings);
    }

    async setAdvancedSettings(params) {
        // const params = {};
        return await post(this.host, endpoints.advancedSettings, params);
    }

    async getExternalSettings() {
        return await get(this.host, endpoints.externalSettings);
    }

    async setExternalSettings(params) {
        // const params = {};
        return await post(this.host, endpoints.externalSettings, params);
    }

    async getDetailSetup() {
        return await get(this.host, endpoints.detailSetup);
    }

    async setDetailSetup(params) {
        // const params = {};
        return await post(this.host, endpoints.detailSetup, params);
    }

    async getGamma() {
        return await get(this.host, endpoints.gamma);
    }

    async setGamma(params) {
        // const params = {};
        return await post(this.host, endpoints.gamma, params);
    }

    /**
     * Gets the Pan, Tilt and Zoom speed on a camera
     * @returns {Object} speeds
     * @returns {Number} speeds.PanSpeed - the pan speed
     * @returns {Number} speeds.TiltSpeed - the tilt speed
     * @returns {Number} speeds.ZoomSpeed - the zoom speed
     */
    async getPTZSpeed() {
        return await get(this.host, endpoints.ptzSetup);
    }

    /**
     * Sets the Pan, Tilt and Zoom speed on a camera
     * Will attempt to coerce non-numbers and truncate resulting values to valid ranges
     * @param {number} PanSpeed - The Pan speed. Valid range is [0,21]. Ignored for PF120
     * @param {number} TiltSpeed - The Tilt speed. Valid range is [0,18]. Ignored for PF120
     * @param {number} ZoomSpeed - The Zoom speed. Valid range is [0,8] for the PF120 and [0,7] for everything else
     * @returns {boolean} true if the camera response matches the coerced and truncated values, false otherwise
     */
    async setPTZSpeed({ PanSpeed, TiltSpeed, ZoomSpeed }) {
        const params = {};
        if (PanSpeed && this.model !== 'PF120') params.PanSpeed = truncate(Number(PanSpeed), 0, 21);
        if (TiltSpeed && this.model !== 'PF120') params.TiltSpeed = truncate(Number(TiltSpeed), 0, 18);
        if (ZoomSpeed) params.ZoomSpeed = truncate(Number(ZoomSpeed), 0, this.model === 'PF120' ? 8 : 7);
        const { PanSpeed: p, TiltSpeed: t, ZoomSpeed: z } = await post(this.host, endpoints.ptzSetup, params);
        return p === params.PanSpeed && t === params.TiltSpeed && z === params.ZoomSpeed;
    }

    /**
     * This command will recall a preset
     * @param {Number} preset - the preset number to recall. Valid range is [1,9]
     */
    async recallPreset(preset) {
        return await post(this.host, endpoints.recallPreset, { Preset: `Preset-${preset}` });
    }

    /**
     * This command will save a preset
     * @param {Number} preset - the preset number to save. Valid range is [1,9]
     */
    async savePreset(preset) {
        return await post(this.host, endpoints.savePreset, { Preset: `Preset-${preset}` });
    }

    async pantilt(direction, speed = {}) {
        let cmdHeader = viscaCommands.pantilt.header({ pan: speed.pan || 0x05, tilt: speed.tilt || 0x05 });
        if (direction in viscaCommands.pantilt)
            this.viscaSend(cmdHeader.concat(viscaCommands.pantilt[direction]))
    }

    async zoom(direction, speed) {
        let cmdHeader = viscaCommands.zoom.header;
        let cmd;
        if (direction in viscaCommands.zoom) {
            if (direction == 'stop') cmd = viscaCommands.zoom[direction]
            else cmd = viscaCommands.zoom[direction](Number(speed) || 0x03)

            this.viscaSend(cmdHeader.concat(cmd));
        }
    }

    viscaSend(data) {
        const header = [0x01, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00]
        const packet = Buffer.from(header.concat(data));
        // console.log(packet)
        this.viscaSock.send(packet, viscaPort, this.host, (err) => {
            if (err) console.log(err);
        });
    }
}
