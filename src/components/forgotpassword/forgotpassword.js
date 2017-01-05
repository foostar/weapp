const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function ForgotPassword(key) {
    Component.call(this, key)
    this.data = {
        imgCodeUrl: '',
        imgKey: '',
        step: 1,
        inputUsername: null, // 输入的用户名
        inputCode: null,     // 输入图片的验证码
        inputPhoneCode: null, // 输入手机验证码
        inputEmailCode: null,  // 输入邮箱验证码
        inputNewpwd: null,   // 输入新的密码
        inputRpwd: null,     // 输入确认密码
        errMessage: '',
        isShow: false,
        appColor: `#${app.config.COLOR}`
    }
}
ForgotPassword.prototype = Object.create(Component.prototype)
ForgotPassword.prototype.name = 'forgotpassword'
ForgotPassword.prototype.constructor = ForgotPassword


ForgotPassword.prototype.onLoad = function () {
    this.getImgCode()
}


ForgotPassword.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '找回密码'
    })
}

// 获取验证码
ForgotPassword.prototype.getImgCode = function () {
    return app.api.getImgCode({ change: 1 })
        .then(res => {
            const { key, url } = res.body
            console.log(key, url)
            this.setData({
                imgCodeUrl: `${url}&change=1&t=${Date.now()}`,
                imgKey: key
            })
        })
}

// 找回密码
ForgotPassword.prototype.findPassword = function (options) {
    return app.api.findPassword(options)
}

// 重新获取验证码
ForgotPassword.prototype.changeCode = function () {
    this.getImgCode()
}
// 输入的用户名
ForgotPassword.prototype.inputUsername = function (event) {
    const { value } = event.detail
    this.setData({
        inputUsername: value
    })
}
// 输入图片的验证码
ForgotPassword.prototype.inputCode = function (event) {
    const { value } = event.detail
    this.setData({
        inputCode: value
    })
}
// 输入手机验证码
ForgotPassword.prototype.inputPhoneCode = function (event) {
    const { value } = event.detail
    this.setData({
        inputPhoneCode: value
    })
}
// 输入邮箱验证码
ForgotPassword.prototype.inputEmailCode = function (event) {
    const { value } = event.detail
    this.setData({
        inputEmailCode: value
    })
}
// 输入新密码
ForgotPassword.prototype.inputNewpwd = function (event) {
    const { value } = event.detail
    clearTimeout(this._input)
    this._input = setTimeout(() => {
        this.setData({
            inputNewpwd: encodeURI(value)
        })
    }, 500)
}
// 确认密码
ForgotPassword.prototype.inputRpwd = function (event) {
    const { inputNewpwd } = this.data
    const { value } = event.detail
    clearTimeout(this._input)
    this._input = setTimeout(() => {
        this.setData({
            inputRpwd: encodeURI(value)
        })
        if (inputNewpwd !== encodeURI(value)) {
            this.setData({
                isShow: true,
                errMessage: '密码不一致'
            })
            this.closeMessagePrompt()
        }
    }, 500)
}


// 检测验证码
ForgotPassword.prototype.checkCode = function () {
    const { inputCode, inputUsername, imgKey } = this.data
    if (!inputUsername) {
        this.setData({
            isShow: true,
            errMessage: '请输入你要找回的账号或手机号'
        })
        this.closeMessagePrompt()
    }
    if (!inputCode) {
        this.setData({
            isShow: true,
            errMessage: '请输入验证码'
        })
        this.closeMessagePrompt()
    }

    if (inputCode && inputUsername) {
        const opt = {
            act: 'send',
            key: imgKey,
            user: inputUsername,
            imgcode: inputCode
        }
        this.findPassword(opt).then(res => {
            if (res.errcode && res.errcode !== '0000000') {
                this.setData({
                    isShow: true,
                    errMessage: res.errcode
                })
                this.closeMessagePrompt()
            } else {
                const { type, phone, email } = res.body
                this.setData({
                    type,
                    phone,
                    email,
                    step: 2
                })
            }
        })
    }
}
// 检测
ForgotPassword.prototype.checkCode2 = function () {
    const { inputPhoneCode, imgKey, inputCode, inputUsername } = this.data
    if (!inputPhoneCode) {
        this.setData({
            isShow: true,
            errMessage: '请输入验证码'
        })
        this.closeMessagePrompt()
    }
    const opt = {
        act: 'check',
        key: imgKey,
        user: inputUsername,
        code: inputPhoneCode,
        imgcode: inputCode
    }
    this.findPassword(opt).then(res => {
        if (res.errcode && res.errcode !== '0000000') {
            this.setData({
                isShow: true,
                errMessage: res.errcode
            })
            this.closeMessagePrompt()
        } else {
            this.setData({
                step: 3
            })
        }
    })
}

// 重置新密码
ForgotPassword.prototype.checkCode3 = function () {
    const { inputPhoneCode, imgKey, inputCode, inputUsername, inputNewpwd, inputRpwd } = this.data
    if (!inputNewpwd || !inputRpwd) {
        this.setData({
            isShow: true,
            errMessage: '请输入重置密码'
        })
        this.closeMessagePrompt()
    }

    const opt = {
        act: 'check',
        key: imgKey,
        user: inputUsername,
        code: inputPhoneCode,
        imgcode: inputCode,
        pwd: inputNewpwd,
        pwdcm: inputRpwd
    }
    this.findPassword(opt).then(() => {
        wx.navigateBack()
    })
}


// 关闭页面提示信息
ForgotPassword.prototype.closeMessagePrompt = function () {
    clearTimeout(this._timer)
    this._timer = setTimeout(() => {
        this.setData({
            isShow: false,
            errMessage: ''
        })
    }, 1500)
}

module.exports = ForgotPassword
