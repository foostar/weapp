const Component = require('../../lib/component.js')

var app = getApp()
function MessagelistFlat(key, module) {
    console.log(module)
    Component.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc
    }
}

MessagelistFlat.prototype = Object.create(Component.prototype)
MessagelistFlat.prototype.name = 'messagelistflat'
MessagelistFlat.prototype.constructor = MessagelistFlat
MessagelistFlat.prototype.onReady = function () {
    this.setData({})
}

MessagelistFlat.prototype.onLoad = function () {
    wx.setNavigationBarTitle({
        title: '消息中心'
    })
}
// 跳转网页
MessagelistFlat.prototype.toNavigationPage = function (e) {
    var typePage = e.currentTarget.dataset.page
    if (app.isLogin()) {
        wx.navigateTo({
            url: `/pages/blank/blank?type=${typePage}`
        })
    }
}

module.exports = MessagelistFlat
