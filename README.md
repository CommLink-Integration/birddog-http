# birddog-http
A Node.js package to communicate with BirdDog devices.
This implements v2.0.0 of the BirdDog API as described by https://bird-dog.tv/SW/API/index.html
Please note that you need to update all devices to the LTS firmware

**This is still a work in progress**

**Confirmed to be working with the P100, P200, Flex Out and Flex In.**

Other models have not been confirmed to be working because I don't have access to the hardware but
should be more-or-less functional as-is.

This has undergone basic testing but there will likely be uncaught cases. Issues and pull-requests are welcome.

To add a new model, a new file should be added to the models folder and models/index.js should be updated to reflect.

The `new BirdDog()` constructor attempts to identify the device it's connecting to based on the response to the `/version` endpoint.
For devices that I don't have access to, I'm not currently able to fill in the expected responses in the `GenericBirdDog` class . If you do, please open an issue or pull request so I can add them in. The name is the value returned from the hwVersion command in the quickstart

If your device is not listed in the `GenericBirdDog` class you can manually set the model type in the `new BirdDog()` constructor using the `model` property. Valid model names can be found in `src/models/index.js`

This package intends to be a transparent interface between a higher-level implementation and the device and only stops you from making a request that a particular device does not support. Parameter values are not (at least currently) validated.
In general, responses are passed straight through from the device. i.e. the property names are not changed from what the device expects. There are some basic formatting fixes like extra " characters removed from strings, and raw string responses shoved into an object before being returned. This does mean, however, that most received property values are string types and must be converted to Numbers if necessary

For devices that are not on a supported firmware, you can still send v1 API commands using the `v1Get` and `v1Set` functions on your 
BirdDog instance. You will also need to set the model type for this method to work (see `test/test.js` for an example).

**TODO:**
- Add A200
- Add A300
- Add PF120
- Add P400
- Add P4K
- Add Studio
- Add Mini
- Add WPEncode
- Add WPDecode
- Add 4KHDMISDI
- Add Quad


## Install
`npm install birddog-http`

## Quick start

**NOTE: A more complete usage example can be found in the test folder**

```js
const { BirdDog } = require('birddog-http');

let bd;
async function tryCatchWrapper(f, args) {
    return await bd[f](args).catch((err) => '!!!!! ' + err.message);
}

async function testBasicInfo() {
    console.log('about', await tryCatchWrapper('about'));
    console.log('hostname', await tryCatchWrapper('hostname'));
    console.log('hwVersion', await tryCatchWrapper('hwVersion'));
}

(async () => {
    bd = await new BirdDog({ host: '172.16.10.200', debug: true });
    await testBasicInfo();
})();

```