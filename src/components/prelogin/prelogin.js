const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function PreLogin(key) {
    Component.call(this, key)
    this.data = {
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow: false,
        isBind: 0
    }
}
PreLogin.prototype = Object.create(Component.prototype)
PreLogin.prototype.name = 'prelogin'
PreLogin.prototype.constructor = PreLogin

PreLogin.prototype.onLoad = function () {
    const self = this
    if (app.globalData.wechat_userInfo) {
        const { avatarUrl, nickName } = app.globalData.wechat_userInfo
        app.api.platformInfo(Object.assign({}, { token: app.globalData.wxtoken }, app.globalData.wxchat_bind_info))
            .then(res => {
                this.setData({
                    appIcon: avatarUrl,
                    username: nickName,
                    // 获取app 图标 主题颜色
                    appColor: `#${app.config.COLOR}`,
                    isBind: res.body.register
                })
            }, err => {
                if (err.data.errcode === 102 || err.data.errcode === 103) {
                    app.wxLogin().then(() => {
                        return app.fetchAuthUser()
                    })
                    .then(() => self.onLoad())
                }
            })
    } else {
        console.log(22222)
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
