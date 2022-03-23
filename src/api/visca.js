const dgram = require('dgram');
const { Buffer } = require('buffer');

const DEBUG = false;

const commands = {
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

const port = 52381;

const defaultPanTiltSpeed = 0x05;
const defaultZoomSpeed = 0x03;

module.exports = class Visca {
    constructor(host) {
        this.sock = dgram.createSocket('udp4');;
        this.host = host;
    }

    async pantilt(direction, panSpeed, tiltSpeed) {
        const speedPan = Number(panSpeed) || defaultPanTiltSpeed;
        const speedTilt = Number(tiltSpeed) || speedPan;

        let cmdHeader = commands.pantilt.header({ pan: speedPan, tilt: speedTilt});
        if (direction in commands.pantilt)
            this.send(cmdHeader.concat(commands.pantilt[direction]))
    }

    async zoom(direction, zoomSpeed) {
        let cmdHeader = commands.zoom.header;
        let cmd;
        if (direction in commands.zoom) {
            if (direction == 'stop') cmd = commands.zoom[direction]
            else cmd = commands.zoom[direction](Number(zoomSpeed) || defaultZoomSpeed)

            this.send(cmdHeader.concat(cmd));
        }
    }

    send(data) {
        const header = [0x01, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00]
        const packet = Buffer.from(header.concat(data));
        if (DEBUG) console.log(packet)
        this.sock.send(packet, port, this.host, (err) => {
            if (err) console.log(err);
        });
    }

}
