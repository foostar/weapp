var app = getApp()

Page({
    data: {
        info: {}
    },
    onLoad() {
        this.setData({
            info: app.globalData.info
        })
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: '关于'
        })
    }
})
