const Component = require('../../lib/component')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Myinfo(key) {
    Component.call(this, key)
    this.data = {
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow: false
    }
}
Myinfo.prototype = Object.create(Component.prototype)
Myinfo.prototype.name = 'myinfo'
Myinfo.prototype.constructor = Myinfo

Myinfo.prototype.onLoad = function () {
    // 获取app 图标 主题颜色
    this.setData({
        appIcon: app.globalData.info.appIcon,
        appColor: app.config.COLOR
    })
}

Myinfo.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '我的消息'
    })
}
// 跳转网页
Myinfo.prototype.toNavigationPage = function (e) {
    var typePage = e.target.dataset.page
    wx.navigateTo({
        url: `/pages/blank/blank?type=mylistcompos&data=${JSON.stringify({ type: typePage })}`
    })
}

module.exports = Myinfo
