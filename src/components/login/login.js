const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Login(key, module) {
    this.module = module
    Component.call(this, key)
    this.data = {
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow: false
    }
}
Login.prototype = Object.create(Component.prototype)
Login.prototype.name = 'login'
Login.prototype.constructor = Login

Login.prototype.onLoad = function () {
    // 获取app 图标 主题颜色
    this.setData({
        appIcon: app.globalData.info.appIcon,
        appColor: `#${app.config.COLOR}`
    })
}

Login.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '登录'
    })
}

Login.prototype.toLogin = function (e) {
    let { username, password } = e.detail.value
    username = encodeURIComponent(username)
    const { loginType: type } = this.module.data
    if (type === 'bindolduser') {
        return app.api.bindPlatform(Object.assign({ token: app.globalData.wxtoken, username, password }, app.globalData.wxchat_bind_info))
            .then(res => {
                console.log('success', res)
                app.globalData.userInfo = res.body
                app.api.token = res.body.token
                app.api.secret = res.body.secret
                app.event.trigger('login', res.body)
                try {
                    wx.setStorageSync('userInfo', res.body)
                    wx.navigateBack()
                } catch (err) {
                    console.log(err)
                }
            }, err => {
                console.log('err', err)
                if (err.data.msg.isValidation == 1) {
                    return wx.redirectTo({
                        url: `/pages/blank/blank?type=verifymobile&data=${JSON.stringify({ username, password, type: 'bindPlatform' })}`
                    })
                }
            })
    }
    return app.api.signin({ username, password, isValidation: 1 })
    .then(res => {
        console.log('success', res)
        if (res.isValidation == 0) {
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
        } else {
            return wx.redirectTo({
                url: `/pages/blank/blank?type=verifymobile&data=${JSON.stringify({ username, password, type: 'signin' })}`
            })
        }
    })
    .catch(err => {
        if (parseInt(err.status / 100, 10) === 4) {
            this.setData({
                isShow: true,
                errMessage: err.message
            })
            this.closeMessagePrompt()
        }
    })
}

Login.prototype.closeMessagePrompt = function () {
    setTimeout(() => {
        this.setData({
            isShow: false,
            errMessage: ''
        })
    }, 1500)
}

module.exports = Login

