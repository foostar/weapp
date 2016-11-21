const Component = require('../../lib/component.js')

function NotSupport(key) {
    Component.call(this, key)
}
var app = getApp()
NotSupport.prototype = Object.create(Component.prototype)
NotSupport.prototype.name = 'notsupport'
NotSupport.prototype.constructor = NotSupport
NotSupport.prototype.onLoad = function () {
    const systemInfo = app.globalData.systemInfo
    const windowWidth = systemInfo.windowWidth
    const imageHeight = `${((windowWidth / 430) * 295).toFixed(2)}px`
    this.setData({
        imageHeight
    })
}
NotSupport.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '暂不支持'
    })
}

module.exports = NotSupport
