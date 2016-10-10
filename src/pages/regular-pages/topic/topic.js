var app = getApp(),
    util = require('../../../utils/util.js')

Page({
    data: {
        id: '',
        tpcinfo: {},
        topUser: [],
        partinNum: 0,
        newList: [],
        newPage: 0,
        newTotalNum: 0,
        hotList: [],
        hotPage: 0,
        hotTotalNum: 0,
        color: '#000',
        currentIndex: 0,
        tabs: ['最新', '最热']
    },
    onLoad: function (data) {
        console.log(app)
        this.setData({
            id: data.id,
            color: app.globalData.info.appColor
        })
        this.fetchData()
    },
    fetchData: function () {
        // NEW HOT
        var ti_id = this.data.id
        Promise
            .all([
                app.api.topicdtl({ 'ti_id': ti_id, 'orderby': 'NEW' }), 
                app.api.topicdtl({ 'ti_id': ti_id, 'orderby': 'HOT' })
            ])
            .then(([ resultByNew, resultByHot ]) => {
                resultByNew.list = resultByNew.list.map(v => {
                    v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                    v.last_reply_date = util.formatTime(v.last_reply_date)
                    v.subject = util.formateText(v.subject)
                    v.title = util.formateText(v.title)
                    return v
                })
                resultByHot.list = resultByHot.list.map(v => {
                    v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                    v.last_reply_date = util.formatTime(v.last_reply_date)
                    v.subject = util.formateText(v.subject)
                    v.title = util.formateText(v.title)
                    return v
                })
                this.setData({
                    tpcinfo: resultByNew.tpcinfo,
                    topUser: resultByNew.topUser,
                    partinNum: resultByNew.partinNum,
                    newList: resultByNew.list,
                    newPage: resultByNew.page,
                    newTotalNum: resultByNew.total_num,
                    hotList: resultByHot.list,
                    hotPage: resultByHot.page,
                    hotTotalNum: resultByHot.total_num,
                })
            })
    },
    onReady: function () {
        console.log(this.data)
        var title = this.data.tpcinfo.ti_title
        // 修改导航条
        wx.setNavigationBarTitle({
            title: title
        })
    },
    changeTabs: function (e) {
        // 切换选项卡
        this.setData({
            currentIndex: e.currentTarget.dataset.index
        })
    },
    toUserHome: function (e) {
        wx.navigateTo({
            url: '/pages/regular-pages/user-home/user-home?uid=' + e.currentTarget.dataset.uid
        })
    }
})

