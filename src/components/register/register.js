const Component = require('../../lib/component')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Register(key) {
    Component.call(this, key)
    this.data = {
        isMobileRegisterValidation: 0,
        isCloseEmail: 1,
        isFastRegister: 0,
        isInviteActivity: 0,
        appColor: '',
        appIcon: '',
        mobile: '',
        code: '',
        verifyBtn: '获取验证码',
        errMessage: '',
        isShow: false,
        isVerify: false,
        isFetch: true
    }
}
Register.prototype = Object.create(Component.prototype)
Register.prototype.name = 'register'
Register.prototype.constructor = Register

Register.prototype.onLoad = function () {
     // 获取app 图标 主题颜色
    this.setData({
        appIcon: app.globalData.info.appIcon,
        appColor: app.globalData.info.appColor
    })
    // 获取用户的主配置信息
    app.api.getSetting().then(res => {
        this.setData({
            isMobileRegisterValidation: res.body.plugin.isMobileRegisterValidation,
            isCloseEmail: res.body.plugin.isCloseEmail,
            isFastRegister: res.body.plugin.isFastRegister,
            isInviteActivity: res.body.plugin.isInviteActivity
        })
    })
}

Register.prototype.onReady = function () {
    if (app.globalData.userInfo) {
        wx.redirectTo({
            url: '/pages/blank/blank?type=mylistcompos'
        })
    }
    if (this.data.isMobileRegisterValidation == 1) {
        wx.setNavigationBarTitle({
            title: '手机号注册'
        })
    } else {
        wx.setNavigationBarTitle({
            title: '用户注册'
        })
    }
}

// 手机验证
Register.prototype.getCode = function () {
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
Register.prototype.setMobile = function (e) {
    // console.log('获取页面输入手机号')
    this.setData({
        mobile: e.detail.value ? e.detail.value : ''
    })
}

Register.prototype.setCode = function (e) {
    // console.log('获取页面输入的验证码')
    this.setData({
        code: e.detail.value ? e.detail.value : ''
    })
}

// 关闭页面提示信息
Register.prototype.closeMessagePrompt = function () {
    this.setData({
        isShow: false,
        errMessage: ''
    })
}
// 检测手机和验证码
Register.prototype.checkMobileCode = function (e) {
    const { mobile, verify } = e.detail.value
    app.api.checkMobileCode(mobile, verify)
        .then(res => {
            console.log('检测手机和验证码', res)
            this.setData({
                isVerify: true
            })
        })
        .catch(err => {
            if (parseInt(err.status / 100, 10) === 4) {
                this.setData({
                    isShow: true,
                    errMessage: err.message
                })
                setTimeout(this.closeMessagePrompt, 1500)
            }
        })
}
// 设置按钮的内容 （倒计时）
Register.prototype.changeMobileBtn = function () {
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
Register.prototype.signup = function (e) {
    const { username, password, email } = e.detail.value
    app.api.signup(username, password, email)
        .then(res => {
            console.log(res)
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
                setTimeout(this.closeMessagePrompt, 1500)
            }
        })
}


module.exports = Register
