const { get, post, endpoints } = require('../api.js');
/**
 * Implements the portions of the API that every BirdDog device should respond to
 */
module.exports = class BaseModel {
    constructor({ host, debug = false }) {
        this._debug = debug;
        this.host = host;
    }

    async v1Get(endpoint) {
        return await get(this.host, endpoint);
    }

    async v1Set(endpoint, params) {
        return await post(this.host, endpoint, params);
    }

    /**
     * Retrieve basic information from your BirdDog device
     * @returns {Object}
     */
    async about() {
        return await get(this.host, endpoints.about);
    }

    /**
     * Retrieve the device hostname
     * @returns {Object} ret
     * @returns {String} ret.hostname - the hostname of the device
     */
    async hostname() {
        return { hostname: await get(this.host, endpoints.hostname) };
    }

    /**
     * This command will immediately initiate a reboot of the BirdDog device.
     */
    async reboot() {
        return await get(this.host, endpoints.reboot);
    }

    /**
     * This command will initiate a video system restart on the BirdDog device.
     */
    async restart() {
        return await get(this.host, endpoints.restart);
    }

    /**
     * This command will recall the BirdDog hardware identifier, this includes the model number as well as the hardware version.
     * @returns {Object} ret
     * @returns {String} ret.version - the model number and hardware version
     */
    async hwVersion() {
        return { version: await get(this.host, endpoints.version) };
    }

    /**
     * Sets the screensaver frame for encode/decode
     * @returns
     */
    async setScreensaver() {
        return await get(this.host, endpoints.capture);
    }

    async getAnalogAudio() {
        return await get(this.host, endpoints.analogAudioSetup);
    }

    async setAnalogAudio(params) {
        return await post(this.host, endpoints.analogAudioSetup, params);
    }

    async ndiGetConnection() {
        return await get(this.host, endpoints.connectTo);
    }

    /**
     * @param {object} connection - the NDI connection to make
     * @param {string} connection.connectToIp -
     * @param {string} connection.port
     * @param {string} connection.sourceName
     * @param {string} connection.status
     * @param {string} connection.sourcePcName
     * @returns
     */
    async ndiSetConnection(params) {
        return await post(this.host, endpoints.connectTo, params);
    }

    /**
     * This command will get the list of active NDI Sources on the Network
     * @returns
     */
    async ndiListSources() {
        return await get(this.host, endpoints.ndiListSources);
    }

    /**
     * This command will immediately refresh NDI Source List.
     * @returns
     */
    async ndiRefreshSources() {
        return await get(this.host, endpoints.ndiSourceRefresh);
    }

    /**
     * This command will immediately reset NDI Source List.
     * @returns
     */
    async ndiResetSources() {
        return await get(this.host, endpoints.ndiSourceReset);
    }

    /**
     * This command will return Group Name
     * @returns
     */
    async getNDIGroupName() {
        const response = await get(this.host, endpoints.ndiGroupName);
        return {
            ndiGroupName: typeof response === 'string' ? response.replace(/"/g, '') : '',
        };
    }

    /**
     * This command will set Group Name
     * @param {string} name - The new NDI group name
     * @returns
     */
    async setNDIGroupName(name) {
        const response = await post(this.host, endpoints.ndiGroupName, name);
        return { ndiGroupName: response.replace(/"/g, '') };
    }

    /**
     * This command will return Off Subnet IP List
     * @returns
     */
    async getNDIOffSubnet() {
        const response = await get(this.host, endpoints.ndiOffSubnetIP);
        return { ndiOffSubnet: response.replace(/"/g, '').split(',') };
    }

    /**
     * This command will set Off Subnet IP
     * @param {string} subnet - The subnet
     * @returns
     */
    async setNDIOffSubnet(subnet) {
        const response = await post(this.host, endpoints.ndiOffSubnetIP, subnet);
        return { ndiOffSubnet: response.replace(/"/g, '').split(',') };
    }

    /**
     * This command will get NDI Discovery server info
     * @returns
     */
    async getNDIDiscoveryServer() {
        return await get(this.host, endpoints.ndiDiscoveryServer);
    }

    /**
     * This command will set NDI Discovery server info
     * @param {string} NDIDisServ - possible values are NDIDisServEn (to enable) or NDIDisServDis (to disable)
     * @param {string} NDIDisServIP - The IP address of the NDI Discovery Server
     * @returns {Object} {NDIDisServ: 'NDIDisServEn', NDIDisServIP: 'xxx.xxx.xxx.xxx'}
     */
    async setNDIDiscoveryServer({ NDIDisServ, NDIDisServIP }) {
        return await post(this.host, endpoints.ndiDiscoveryServer, { NDIDisServ, NDIDisServIP });
    }
}
