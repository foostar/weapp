const Component = require('../../lib/component')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Login(key) {
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
        appColor: app.globalData.info.appColor
    })
}

Login.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '登录'
    })
}

Login.prototype.toLogin = function (e) {
    const { username, password } = e.detail.value
    app.api.signin(username, password)
    .then(res => {
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
    }, error => console.log(error))
    .catch(err => {
        if (parseInt(err.status, 10) / 100 == 4) {
            this.setData({
                isShow: true,
                errMessage: err.message
            })
            setTimeout(this.closeMessagePrompt, 1500)
        }
    })
}

Login.prototype.closeMessagePrompt = function () {
    this.setData({
        isShow: false,
        errMessage: ''
    })
}


module.exports = Login

