const Component = require('../../lib/component.js')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Changepassword(key) {
    Component.call(this, key)
    this.data = {
        errMessage: '',
        isShow: false,
        appColor: `#${app.config.COLOR}`
    }
}
Changepassword.prototype = Object.create(Component.prototype)
Changepassword.prototype.name = 'changepassword'
Changepassword.prototype.constructor = Changepassword


Changepassword.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: '修改密码'
    })
}

Changepassword.prototype.changepassword = function (e) {
    const { oldPassword, newPassword, replacePassword } = e.detail.value
    if (newPassword !== replacePassword) {
        this.setData({
            errMessage: '确认密码输入不一致',
            isShow: true
        })
        return setTimeout(this.closeMessagePrompt, 1500)
    }
    app.api.updateUserPassword(oldPassword, newPassword)
    .then(res => {
        console.log('检测手机和验证码', res)
        wx.navigateBack()
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
// 关闭页面提示信息
Changepassword.prototype.closeMessagePrompt = function () {
    this.setData({
        isShow: false,
        errMessage: ''
    })
}

module.exports = Changepassword
