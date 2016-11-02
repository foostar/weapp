var app = getApp()
Page({
    data: {
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow: false
    },
    onLoad() {
        // 获取app 图标 主题颜色
        this.setData({
            appIcon: app.globalData.info.appIcon,
            appColor: app.globalData.info.appColor
        })
    },
    onReady() {
        if (app.globalData.userInfo) {
            wx.redirectTo({
                url: '/pages/regular-pages/my/my'
            })
        }
        wx.setNavigationBarTitle({
            title: '登录'
        })
    },
    login(e) {
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
        })
        .catch((err) => {
            if (parseInt(err.status / 100, 10) === 4) {
                this.setData({
                    isShow: true,
                    errMessage: err.message
                })
                setTimeout(this.closeMessagePrompt, 1500)
            }
        })
    },
    closeMessagePrompt() {
        this.setData({
            isShow: false,
            errMessage: ''
        })
    }
})
