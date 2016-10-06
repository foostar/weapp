var app = getApp()
Page({
    data:{
        isMobileRegisterValidation: 0,
        isCloseEmail:1,
        isFastRegister: 0,
        isInviteActivity: 0,
        appColor: '',
        appIcon: ''
    },
    onLoad() {
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
    },
    onReady() {
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
})