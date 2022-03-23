
/*
    This implements v2.0.0 of the BirdDog API as described by https://bird-dog.tv/SW/API/index.html
    Please note that you need to update all devices to the LTS firmware
 */

module.exports = v2 = {
    // #region Basic Device Info
    about: '/about',
    hostname: '/hostname',
    reboot: '/reboot',
    restart: '/restart',
    version: '/version',
    // #endregion Basic Device Info

    // #region Device Settings
    analogAudioSetup: '/analogaudiosetup',
    operationMode: '/operationmode',
    videoOutputInterface: '/videooutputinterface',
    // #endregion Device Settings

    // #region NDI Encode
    encodeSetup: '/encodesetup',
    encodeTransport: '/encodeTransport',
    // #endregion NDI Encode

    // #region NDI Decode
    capture: '/capture',
    connectTo: '/connectTo',
    decodeTransport: '/decodeTransport',
    decodeSetup: '/decodeSetup',
    decodeStatus: '/decodeStatus',
    // #endregion NDI Decode

    // #region NDI Finder
    ndiListSources: '/List',
    ndiDiscoveryServer: '/NDIDisServer',
    ndiGroupName: '/NDIGrpName',
    ndiOffSubnetIP: '/NDIOffSnSrc',
    ndiSourceRefresh: '/refresh',
    ndiSourceReset: '/reset',
    // #endregion NDI Finder

    // #region PTZ
    ptzSetup: '/birddogptzsetup',
    recallPreset: '/recall',
    savePreset: '/save',
    // #endregion PTZ

    // #region Exposure
    exposure: '/birddogexpsetup',
    // #endregion Exposure

    // #region White Balance
    whiteBalance: '/birddogwbsetup',
    // #endregion White Balance

    // #region Picture Settings
    pictureSetup: '/birddogpicsetup',
    // #endregion Picture Settings

    // #region Color Matrix
    colorMatrix: '/birddogcmsetup',
    // #endregion Color Matrix

    // #region Advanced Settings
    advancedSettings: '/birddogadvancesetup',
    // #endregion Advanced Settings

    // #region External Settings
    externalSettings: '/birddogexternalsetup',
    // #endregion External Settings

    // #region Detail
    detailSetup: '/birddogdetsetup',
    // #endregion Detail

    // #region Gamma
    gamma: '/birddoggammasetup',
    // #endregion Gamma
};
