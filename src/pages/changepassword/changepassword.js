var app = getApp()
Page({
    data: {
        errMessage: '',
        isShow: false
    },
    onLoad() {
        this.setData({
            appColor: app.globalData.info.appColor
        })
    },

    onReady() {
        wx.setNavigationBarTitle({
            title: '修改密码'
        })
    },

    // 修改密码
    changepassword(e) {
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
    },

    // 关闭页面提示信息
    closeMessagePrompt() {
        this.setData({
            isShow: false,
            errMessage: ''
        })
    },
})
