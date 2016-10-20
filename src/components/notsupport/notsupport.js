const Component = require('../../lib/component')

function NotSupport(key) {
    Component.call(this, key)
}

NotSupport.prototype = Object.create(Component.prototype)
NotSupport.prototype.name = 'notsupport'
NotSupport.prototype.constructor = NotSupport

NotSupport.prototype.onLoad = function () {
    wx.setNavigationBarTitle({
        title: ''
    })
}

module.exports = NotSupport
