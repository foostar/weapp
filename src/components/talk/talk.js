const Component = require('../../lib/component.js')

const app = getApp()

function Talk(key) {
    Component.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc
    }
}

Talk.prototype = Object.create(Component.prototype)
Talk.prototype.name = 'talk'
Talk.prototype.constructor = Talk
Talk.prototype.onLoad = function () {
    // 设置tabs 和 color
    this.setData({
        tabs: app.globalData.tabs,
        color: `#${app.config.COLOR}`
    })
    // 判断用户是否登录
    if (app.globalData.userInfo) {
        this.setData({
            isLogin: true,
            userInfo: app.globalData.userInfo
        })
    }
    // 监听用户是否登录
    app.event.on('login', userInfo => {
        this.setData({
            isLogin: true,
            userInfo
        })
        this.fetchData()
    })
    // 获取数据
    this.fetchData()
}
Talk.prototype.fetchData = function () {
    var querys = [ app.api.topic() ]
    if (this.data.isLogin) {
        querys.push(app.api.mytopic())
    }
    Promise
        .all(querys)
        .then(result => {
            this.setData({
                topic: result[0],
                mytopic: (result.length > 1 ? result[1] : {})
            })
        })
}
Talk.prototype.toLogin = function () {
    if (!this.data.isLogin) {
        wx.navigateTo({
            url: '/pages/blank/blank?type=login'
        })
    }
}
// 跳转到话题页
Talk.prototype.toNavigator = function (e) {
    const { id } = e.currentTarget.dataset
    app.topic({ id })
}

module.exports = Talk
