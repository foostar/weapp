const Component = require('../../lib/component.js')

const app = getApp()

function PreLogin(key) {
    Component.call(this, key)
    this.data = {
        appColor: `#${app.config.COLOR}`,
        isBind: 0,
        isFastLogin: false
    }
}
PreLogin.prototype = Object.create(Component.prototype)
PreLogin.prototype.name = 'prelogin'
PreLogin.prototype.constructor = PreLogin

PreLogin.prototype.onLoad = function () {
    return app.getTokenPromise().then(token => {
        return app.getUserInfoPromise().then(({ encryptedData, iv, rawData, signature }) => {
            return [ token, { encryptedData, iv, rawData, signature } ]
        })
    }).then(([ token, { encryptedData, iv, rawData, signature } ]) => {
        const { avatarUrl, nickName } = JSON.parse(rawData)
        return app.api.platformInfo({ token, encryptedData, iv, rawData, signature })
            .then(res => {
                this.setData({
                    appIcon: avatarUrl,
                    username: nickName,
                    isBind: res.body.register,
                    isFastLogin: true
                })
            }, (err) => Promise.reject(err))
    }).catch(e => {
        if (e.data && e.data.msg) {
            return app.event.trigger('errormessage', e.data.msg)
        }
        app.event.trigger('errormessage', e.msg)
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
    return app.getTokenPromise().then(token => {
        return app.getUserInfoPromise().then(({ encryptedData, iv, rawData, signature }) => {
            return [ token, { encryptedData, iv, rawData, signature } ]
        })
    }).then(([ token, { encryptedData, iv, rawData, signature } ]) => {
        return app.api.platLogin({ token, encryptedData, iv, rawData, signature })
            .then(res => {
                if (!res.errcode) {
                    app.saveUserInfo(res)
                    wx.navigateBack()
                } else {
                    return Promise.reject(res)
                }
            })
    }).catch(e => {
        app.event.trigger('errormessage', e.msg)
    })
}


module.exports = PreLogin
