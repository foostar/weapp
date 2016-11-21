const Component = require('../../lib/component.js')

const app = getApp()

function About(key) {
    Component.call(this, key)
    this.data = {
        info: {}
    }
}
About.prototype = Object.create(Component.prototype)
About.prototype.name = 'about'
About.prototype.constructor = About


About.prototype.onLoad = function () {
    this.setData({
        info: app.globalData.info
    })
}
About.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '关于'
    })
}

module.exports = About
