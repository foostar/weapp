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
    Promise.all([
        app.getTokenPromise(),
        app.getUserInfoPromise()
    ]).then(([ token, { encryptedData, iv, rawData, signature } ]) => {
        const { avatarUrl, nickName } = JSON.parse(rawData)
        return app.api.platformInfo({ token, encryptedData, iv, rawData, signature })
            .then(res => {
                this.setData({
                    appIcon: avatarUrl,
                    username: nickName,
                    isBind: res.body.register,
                    isFastLogin: true
                })
            })
    }).catch(e => {
        app.event.trigger('errormessage', e.msg)
    })


    // console.log(111111, app.globalData)
    // if (app.globalData.wechat_userInfo) {
    //     const { avatarUrl, nickName } = app.globalData.wechat_userInfo
    //     app.getStoragePromise('token').then(token => {
    //         app.api.platformInfo(Object.assign({ token }, app.globalData.wechat_bind_info))
    //         .then(res => {
    //             this.setData({
    //                 appIcon: avatarUrl,
    //                 username: nickName,
    //                 isBind: res.body.register,
    //                 isFastLogin: true
    //             })
    //         }, err => {
    //             if ((err.data.errcode === 102 || err.data.errcode === 103) && connectNum > 1) {
    //                 connectNum -= 1
    //                 return app.fetchAuthUser().then(() => self.onLoad())
    //             } else {
    //                 this.setData({
    //                     appIcon: avatarUrl,
    //                     username: nickName,
    //                     isFastLogin: false
    //                 })
    //             }
    //         })
    //     })
    // } else {
    //     console.log(22222)
    //     return app.fetchAuthUser()
    //     .then(() => self.onLoad())
    // }
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
    Promise.all([
        app.getTokenPromise(),
        app.getUserInfoPromise()
    ]).then(([ token, { encryptedData, iv, rawData, signature } ]) => {
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
