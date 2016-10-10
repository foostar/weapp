var app = getApp(),
    util = require('../../../utils/util.js')

Page({
    data: {
        uid: '',
        color: '#000',
        currentIndex: 0,
        tabs: ['发表', '资料'],
        info: {},
        topics: {}
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
        console.log(this.data.info)
    },
    featchData: function () {
        var uid = this.data.uid
        Promise
            .all([
                app.api.user(uid), 
                app.api.getTopicList(uid, 'topic')
            ])
            .then(([info, topics]) => {
                console.log(info, topics)
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
                    tabs: ['发表(' + topics.total_num + ')', '资料']
                })
            })
    }
})