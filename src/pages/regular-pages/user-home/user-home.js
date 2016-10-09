var app = getApp(),
    util = require('../../../utils/util.js')

Page({
    data: {
        uid: '',
        color: '#000',
        currentIndex: 0,
        tabs: ['发表', '资料']
    },
    changeTabs: function (e) {
        // 切换选项卡
        this.setData({
            currentIndex: e.currentTarget.dataset.index
        })
    },
    onReady: function () {
        // 修改导航条
        wx.setNavigationBarTitle({
            title: ''
        })
    },
    onLoad: function (data) {
        console.log(data)
        console.log(app.globalData.userInfo)
        this.setData({
            uid: data.uid,
            color: app.globalData.info.appColor
        })
        this.featchData()
    },
    featchData: function () {

    }
})