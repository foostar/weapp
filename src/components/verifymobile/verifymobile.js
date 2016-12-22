const Component = require('../../lib/component.js')

const app = getApp()

function VerifyMobile(key, module) {
    Component.call(this, key)
    this.data = {
        appIcon: app.globalData.info.appIcon,
        appColor: `#${app.config.COLOR}`,
        mobile: '',
        code: '',
        username: module.data.username,
        password: module.data.password,
        type: module.data.type,
        verifyBtn: '获取验证码',
        errMessage: '',
        isShow: false,
        isFetch: true
    }
}
VerifyMobile.prototype = Object.create(Component.prototype)
VerifyMobile.prototype.name = 'verifymobile'
VerifyMobile.prototype.constructor = VerifyMobile

// 手机验证
VerifyMobile.prototype.getCode = function () {
    if (this.data.isFetch && this.data.mobile) {
        app.api.getCode(this.data.mobile)
            .then(res => console.log(res))
            .catch(err => {
                if (parseInt(err.status / 100, 10) === 4) {
                    this.setData({
                        isShow: true,
                        errMessage: err.message
                    })
                    setTimeout(this.closeMessagePrompt, 1500)
                }
            })
        this.changeMobileBtn()
    }
    if (!this.data.mobile) {
        this.setData({
            isShow: true,
            errMessage: '手机号不能为空'
        })
        setTimeout(this.closeMessagePrompt, 1500)
    }
}

// 获取页面输入手机号
VerifyMobile.prototype.setMobile = function (e) {
    // console.log('获取页面输入手机号')
    this.setData({
        mobile: e.detail.value ? e.detail.value : ''
    })
}

VerifyMobile.prototype.setCode = function (e) {
    // console.log('获取页面输入的验证码')
    this.setData({
        code: e.detail.value ? e.detail.value : ''
    })
}

// 关闭页面提示信息
VerifyMobile.prototype.closeMessagePrompt = function () {
    this.setData({
        isShow: false,
        errMessage: ''
    })
}
// 检测手机和验证码
VerifyMobile.prototype.checkMobileCode = function () {
    const { mobile, code, username, password, type } = this.data
    let promise = {}
    if (type === 'signin') {
        promise = app.api.signin({ username, password, isValidation: 1, mobile, code })
    } else {
        promise = app.api.bindPlatform(Object.assign({ token: app.globalData.wxtoken, username, password, mobile, code }, app.globalData.wxchat_bind_info))
    }

    promise.then(res => {
        console.log('success', res)
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
    })
    .catch(err => {
        if (parseInt(err.status / 100, 10) === 4) {
            this.setData({
                isShow: true,
                errMessage: err.message
            })
            setTimeout(() => {
                this.closeMessagePrompt()
            }, 1500)
        }
    })
}
// 设置按钮的内容 （倒计时）
VerifyMobile.prototype.changeMobileBtn = function () {
    var i = 60
    var timer = setInterval(() => {
        if (i >= 0) {
            this.setData({
                verifyBtn: `请在${i -= 1}后重发`,
                isFetch: false
            })
        }
        if (i == -1) {
            clearInterval(timer)
            this.setData({
                isFetch: true,
                verifyBtn: '获取验证码'
            })
        }
    }, 1000)
}

module.exports = VerifyMobile

