const Component = require('../../lib/component.js')

const app = getApp()

function Setting(key) {
    Component.call(this, key)
    this.data = {
        isLogin: false,
    }
}
Setting.prototype = Object.create(Component.prototype)
Setting.prototype.name = 'setting'
Setting.prototype.constructor = Setting

Setting.prototype.onLoad = function () {
    if (app.globalData.userInfo) {
        this.setData({
            isLogin: true
        })
    }
}

Setting.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '设置'
    })
}

// 跳转网页
Setting.prototype.toNavigationPage = function (e) {
    var typePage = e.currentTarget.dataset.page
    // console.log(typePage)
    wx.navigateTo({
        url: `/pages/blank/blank?type=${typePage}`
    })
}

module.exports = Setting
