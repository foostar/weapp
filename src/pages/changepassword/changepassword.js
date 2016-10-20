var app = getApp()
Page({
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
    changepassword(e){
    }
})