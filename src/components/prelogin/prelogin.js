const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function PreLogin(key) {
    Component.call(this, key)
    this.data = {
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow: false
    }
}
PreLogin.prototype = Object.create(Component.prototype)
PreLogin.prototype.name = 'prelogin'
PreLogin.prototype.constructor = PreLogin

PreLogin.prototype.onLoad = function () {
    const { avatarUrl, nickName } = app.globalData.wechat_userInfo
    // 获取app 图标 主题颜色
    this.setData({
        // appIcon: app.globalData.info.appIcon,
        appIcon: avatarUrl,
        username: nickName,
        appColor: `#${app.config.COLOR}`
    })
    app.api.platformInfo().then(res => {
        console.log(res)
    })
}

PreLogin.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '登录'
    })
}
// 注册
PreLogin.prototype.register = function () {
    wx.redirectTo({
        url: '/pages/blank/blank?type=register'
    })
}
// 原有用户登录
PreLogin.prototype.oldlogin = function () {
    wx.redirectTo({
        url: '/pages/blank/blank?type=oldlogin'
    })
}
// 原有用户登录
PreLogin.prototype.bindolduser = function () {
    wx.redirectTo({
        url: `/pages/blank/blank?type=oldlogin&data=${JSON.stringify({ loginType: 'bindolduser' })}`
    })
}
// 微信快速登录
PreLogin.prototype.platLogin = function () {
    console.log(11111)
    return app.fetchAuthUser().then(() => {
        console.log(33333, app.globalData.wxtoken)
        return app.api.platLogin({ token: app.globalData.wxtoken })
            .then(result => {
                console.log('success', result)
            }, err => {
                console.log('err', err)
            })
    })
}


module.exports = PreLogin
