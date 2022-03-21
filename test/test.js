const { BirdDog, v1 } = require('../src/index');

let bd;
async function tryCatchWrapper(f, args) {
    return await bd[f](args).catch((err) => '!!!!! ' + err.message);
}

async function testBasicInfo() {
    console.log('about', await tryCatchWrapper('about'));
    console.log('hostname', await tryCatchWrapper('hostname'));
    console.log('hwVersion', await tryCatchWrapper('hwVersion'));
}

async function testPTZ() {
    console.log('getPTZSpeed', await tryCatchWrapper('getPTZSpeed'));
    console.log('recallPreset', await tryCatchWrapper('recallPreset', 1));
    console.log('setPTZSpeed', await tryCatchWrapper('setPTZSpeed', { PanSpeed: 99, TiltSpeed: 99, ZoomSpeed: 99 }));
}

async function getCameraSettings() {
    console.log('getWhiteBalance', await tryCatchWrapper('getWhiteBalance'));
    console.log('getExposure', await tryCatchWrapper('getExposure'));
    console.log('getPictureSetup', await tryCatchWrapper('getPictureSetup'));
    console.log('getColorMatrix', await tryCatchWrapper('getColorMatrix'));
    console.log('getAdvancedSettings', await tryCatchWrapper('getAdvancedSettings'));
    console.log('getExternalSettings', await tryCatchWrapper('getExternalSettings'));
    console.log('getDetailSetup', await tryCatchWrapper('getDetailSetup'));
    console.log('getGamma', await tryCatchWrapper('getGamma'));
}

async function testEncoderSettings() {
    console.log('getEncodeSettings', await tryCatchWrapper('getEncodeSettings'));
    console.log('getEncodeTransport', await tryCatchWrapper('getEncodeTransport'));
}

async function testDecoderSettings() {
    console.log('getDecodeStatus', await tryCatchWrapper('getDecodeStatus'));
    console.log('getDecodeSettings', await tryCatchWrapper('getDecodeSettings'));
    console.log('getDecodeTransport', await tryCatchWrapper('getDecodeTransport'));
}

async function getNDIFinder() {
    console.log('ndiListSources', await tryCatchWrapper('ndiListSources'));
    console.log('getNDIGroupName', await tryCatchWrapper('getNDIGroupName'));
    console.log('getNDIOffSubnet', await tryCatchWrapper('getNDIOffSubnet'));
    console.log('getNDIDiscoveryServer', await tryCatchWrapper('getNDIDiscoveryServer'));
}

async function testNDIFinder() {
    await getNDIFinder();
}

async function testCalls() {
    await testBasicInfo();
    await testNDIFinder();
    switch (bd.family) {
        case 'camera':
            await getCameraSettings();
            await testPTZ();
            await testEncoderSettings();
            break;
        case 'encoder':
            await testEncoderSettings();
            break;
        case 'decoder':
            await testDecoderSettings();
            break;
        case 'codec':
            await testEncoderSettings();
            await testDecoderSettings();
            console.log('getOperationMode', await tryCatchWrapper('getOperationMode'));
            break;
    }
}

(async () => {
    // Flex In
    bd = await new BirdDog({ host: '172.16.10.237', debug: true }); // Flex In
    await testCalls();

    // P200
    bd = await new BirdDog({ host: '172.16.4.185', debug: true }); // P200
    await testCalls();

    // Flex Out
    bd = await new BirdDog({ host: '172.16.10.16', debug: true }); // Flex Out
    await testCalls();

    // P100 old firmware
    bd = await new BirdDog({ host: '172.16.4.157', debug: true }); // P100 old firmware
    await testCalls();

    // Mini
    bd = await new BirdDog({ host: '172.16.4.203', model: 'Mini', debug: true }); // Mini
    console.log('encodeSettings', await bd.v1Get(v1.encodeSettings));
    await testCalls();
})();
