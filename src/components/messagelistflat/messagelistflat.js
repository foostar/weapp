const Component = require('../../lib/component')

function MessagelistFlat(key) {
    Component.call(this, key)
}

MessagelistFlat.prototype = Object.create(Component.prototype)
MessagelistFlat.prototype.name = 'messagelistflat'
MessagelistFlat.prototype.constructor = MessagelistFlat

MessagelistFlat.prototype.onLoad = function () {
    wx.setNavigationBarTitle({
        title: '消息中心'
    })
}

module.exports = MessagelistFlat
