var app = getApp()

Page({
    data: {
        info:{}
    },
    onLoad() {
        console.log(app)
        this.setData({
            info: app.globalData.info
        })
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: '关于'
        })
    }
})