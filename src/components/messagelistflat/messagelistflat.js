const Component = require('../../lib/component')

var app = getApp()
function MessagelistFlat(key) {
    Component.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc
    }
}

MessagelistFlat.prototype = Object.create(Component.prototype)
MessagelistFlat.prototype.name = 'messagelistflat'
MessagelistFlat.prototype.constructor = MessagelistFlat

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
