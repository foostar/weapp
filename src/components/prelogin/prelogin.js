const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()
let connectNum = 5
function PreLogin(key) {
    Component.call(this, key)
    this.data = {
        appColor: `#${app.config.COLOR}`,
        errMessage: '',
        isShow: false,
        isBind: 0,
        isFastLogin: false
    }
}
PreLogin.prototype = Object.create(Component.prototype)
PreLogin.prototype.name = 'prelogin'
PreLogin.prototype.constructor = PreLogin

PreLogin.prototype.onLoad = function () {
    console.log(app.globalData.wechat_userInfo, connectNum)
    const self = this
    if (app.globalData.wechat_userInfo) {
        const { avatarUrl, nickName } = app.globalData.wechat_userInfo
        app.api.platformInfo(Object.assign({}, { token: app.globalData.wxtoken }, app.globalData.wxchat_bind_info))
            .then(res => {
                this.setData({
                    appIcon: avatarUrl,
                    username: nickName,
                    isBind: res.body.register,
                    isFastLogin: true
                })
            }, err => {
                if ((err.data.errcode === 102 || err.data.errcode === 103) && connectNum > 1) {
                    connectNum -= 1
                    app.wxLogin().then(() => {
                        return app.fetchAuthUser()
                    })
                    .then(() => self.onLoad())
                } else {
                    this.setData({
                        appIcon: avatarUrl,
                        username: nickName,
                        isFastLogin: false
                    })
                }
            })
    } else {
        app.wxLogin().then(() => {
            return app.fetchAuthUser()
        })
        .then(() => self.onLoad())
    }
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
    const self = this
    return app.api.platLogin(Object.assign({}, { token: app.globalData.wxtoken }, app.globalData.wxchat_bind_info))
        .then(res => {
            console.log('success', res)
            if (!res.errcode) {
                app.globalData.userInfo = res
                app.api.token = res.token
                app.api.secret = res.secret
                app.event.trigger('login', res)
                try {
                    wx.setStorageSync('userInfo', res)
                    wx.navigateBack()
                } catch (err) {
                    console.log(err)
                }
            }
        }, err => {
            console.log('err', err)
            if (err.data.errcode === 102 || err.data.errcode === 103) {
                app.wxLogin().then(() => {
                    return app.fetchAuthUser()
                })
                .then(() => self.platLogin())
            }
        })
}


module.exports = PreLogin
