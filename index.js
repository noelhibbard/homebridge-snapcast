// HomeKit provides an official Service.Speaker type but Apple didn't bother implamenting it in the Home App
// so I am forced use Service.Lightbulb and rether than volume I use brightness.

const request = require('request')

let Service, Characteristic

module.exports = (homebridge) => {
    Service = homebridge.hap.Service
    Characteristic = homebridge.hap.Characteristic
    homebridge.registerAccessory('homebridge-snapcast', 'Snapcast', DimmerAccessory)
}

class DimmerAccessory {
    constructor(log, config) {
        this.log = log
        this.config = config
        this.service = new Service.Lightbulb(this.config.name)
        this.id = '00:00:00:00:00:00'
        this.muted = true
        this.volume = 0
    }

    getServices() {
        const informationService = new Service.AccessoryInformation()
            .setCharacteristic(Characteristic.Manufacturer, 'Noel Hibbard')
            .setCharacteristic(Characteristic.Model, 'Snapcast')
            .setCharacteristic(Characteristic.SerialNumber, 'Snapcast')

        this.service.getCharacteristic(Characteristic.On)
            .on('get', this.getOnCharacteristicHandler.bind(this))
            .on('set', this.setOnCharacteristicHandler.bind(this))

        this.service.getCharacteristic(Characteristic.Brightness)
            .on('get', this.getBrightness.bind(this))
            .on('set', this.setBrightness.bind(this))

        return [informationService, this.service]
    }

    getBrightness(callback) {
        request(this.config.serverUrl, {
            method: 'POST', json: { id: 1, jsonrpc: '2.0', method: 'Server.GetStatus' }
        }, (err, resp, json) => {
            if (err) {
                this.log(err)
            }
            var group
            if (this.config.groupnumber) {
                group = json.result.server.groups[this.config.groupnumber - 1]
            } else {
                group = json.result.server.groups.filter(group => group.name == this.config.groupname)[0]
            }
            group.clients.forEach(client => {
                if (client.config.name == this.config.name) {
                    this.id = client.id
                    this.volume = client.config.volume.percent
                }
            })
            callback(null, this.volume)
        })
    }

    setBrightness(value, callback) {
        request(this.config.serverUrl, {
            method: 'POST', json: { id: 1, jsonrpc: '2.0', method: 'Client.SetVolume', params: { id: this.id, volume: { percent: value } } }
        }, (err, resp, json) => {
            if (err) {
                this.log(err)
            }
            callback(null)
        })
    }

    getOnCharacteristicHandler(callback) {
        request(this.config.serverUrl, {
            method: 'POST', json: { id: 1, jsonrpc: '2.0', method: 'Server.GetStatus' }
        }, (err, resp, json) => {
            if (err) {
                this.log(err)
            }
            var group
            if (this.config.groupnumber) {
                group = json.result.server.groups[this.config.groupnumber - 1]
            } else {
                group = json.result.server.groups.filter(group => group.name == this.config.groupname)[0]
            }
            group.clients.forEach(client => {
                if (client.config.name == this.config.name) {
                    this.muted = client.config.volume.muted
                }
            })
            callback(null, !this.muted)
        })
    }

    setOnCharacteristicHandler(value, callback) {
        request(this.config.serverUrl, {
            method: 'POST', json: { id: 1, jsonrpc: '2.0', method: 'Client.SetVolume', params: { id: this.id, volume: { muted: !value } } }
        }, (err, resp, json) => {
            if (err) {
                this.log(err)
            }
            callback(null)
        })
    }
}