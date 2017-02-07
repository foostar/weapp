const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Register(key) {
    Component.call(this, key)
    this.data = {
        isMobileRegisterValidation: 1,
        isCloseEmail: 1,
        isFastRegister: 0,
        isInviteActivity: 0,
        appIcon: app.globalData.info.appIcon,
        appColor: `#${app.config.COLOR}`,
        mobile: '',
        code: '',
        verifyBtn: '获取验证码',
        errMessage: '',
        imgCode: '',
        isShow: false,
        isVerify: false,
        isFetch: true
    }
}
Register.prototype = Object.create(Component.prototype)
Register.prototype.name = 'register'
Register.prototype.constructor = Register

Register.prototype.onLoad = function () {
    this.getImgCode()
    // 获取用户的主配置信息
    app.api.getSetting().then(res => {
        this.setData({
            isAllowImage: res.body.plugin.allow_image,
            isMobileRegisterValidation: res.body.plugin.isMobileRegisterValidation,
            isCloseEmail: res.body.plugin.isCloseEmail,
            isFastRegister: res.body.plugin.isFastRegister,
            isInviteActivity: res.body.plugin.isInviteActivity
        })
    })
}

Register.prototype.onReady = function () {
    // console.log(this.data)
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

Register.prototype.setImgCode = function (e) {
    // console.log('获取页面输入手机号')
    this.setData({
        imgCode: e.detail.value ? e.detail.value : ''
    })
}


// 手机验证
Register.prototype.getCode = function () {
    const { imgKey, imgCode } = this.data
    if (this.data.isFetch && this.data.mobile) {
        app.api.getCode(this.data.mobile, 'register', { key: imgKey, imgCode })
            .then(res => console.log(res))
            .catch(err => {
                if (parseInt(err.status / 100, 10) === 4) {
                    app.event.trigger('errormessage', err.message)
                }
            })
        this.changeMobileBtn()
    }
    if (!this.data.mobile) {
        app.event.trigger('errormessage', '手机号不能为空')
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

Register.prototype.changeCode = function () {
    this.getImgCode()
}

// 获取验证码
Register.prototype.getImgCode = function () {
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


// 检测手机和验证码
Register.prototype.checkMobileCode = function (e) {
    const { mobile, verify } = e.detail.value
    app.api.checkMobileCode(mobile, verify)
        .then(() => {
            this.setData({
                isVerify: true
            })
        })
        .catch(err => {
            if (parseInt(err.status / 100, 10) === 4) {
                app.event.trigger('errormessage', err.message)
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
    let { username, password, email } = e.detail.value
    email = email || ''
    app.api.signup(username, password, email)
        .then(res => {
            // console.log(res)
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
                app.event.trigger('errormessage', err.message)
            }
        })
}


module.exports = Register
