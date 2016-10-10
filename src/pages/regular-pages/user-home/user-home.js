var app = getApp(),
    util = require('../../../utils/util.js')

Page({
    data: {
        isLogin: false,
        uid: '',
        color: '#000',
        currentIndex: 0,
        tabs: ['发表', '资料'],
        info: {},
        topics: {},
        isLoading: true
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
        var obj = {}

        // 判断用户是否登录
        if (app.globalData.userInfo) {
            obj.isLogin = true
        }
        obj.uid = data.uid
        obj.color = app.globalData.info.appColor

        this.setData(obj)
        this.fetchData()

        app.event.on('login', userInfo => {
            this.setData({
                isLogin: true
            })
        })
    },
    fetchData: function () {
        var uid = this.data.uid
        Promise
            .all([
                app.api.user(uid), 
                app.api.getTopicList(uid, 'topic')
            ])
            .then(([info, topics]) => {
                topics.list = topics.list.map(v => {
                    v.pic_path = v.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                    v.last_reply_date = util.formatTime(v.last_reply_date)
                    v.subject = util.formateText(v.subject)
                    v.title = util.formateText(v.title)
                    return v
                })
                this.setData({
                    info: info,
                    topics: topics,
                    tabs: ['发表(' + topics.total_num + ')', '资料'],
                    isLoading: false
                })
            })
    },
    // 跳转网页
    toNavigationPage: function (e) {
        var typePage = e.target.dataset.page
        var uid = this.data.uid
        if (this.data.isLogin) {
            wx.navigateTo({
                url: '/pages/regular-pages/my/topics?type=' + typePage + '&uid=' + uid
            })
        } else {
            wx.navigateTo({
                url: '/pages/regular-pages/login/login'
            })
        } 
    },
})