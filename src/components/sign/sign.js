const Component = require('../../lib/component.js')

const app = getApp()

function Sign(key) {
    Component.call(this, key)
}
Sign.prototype = Object.create(Component.prototype)
Sign.prototype.name = 'sign'
Sign.prototype.constructor = Sign

Sign.prototype.onLoad = function () {
    app.api.sign().then(success => {
        app.event.trigger('errormessage', success.errcode)
    }, err => {
        app.event.trigger('errormessage', err.errcode)
    })
}

module.exports = Sign
