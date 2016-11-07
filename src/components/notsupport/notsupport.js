const Component = require('../../lib/component')

function NotSupport(key) {
    Component.call(this, key)
}

NotSupport.prototype = Object.create(Component.prototype)
NotSupport.prototype.name = 'notsupport'
NotSupport.prototype.constructor = NotSupport

NotSupport.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '暂不支持'
    })
}

module.exports = NotSupport
