var app = getApp()
var { formatTime } = require('../../../utils/util.js')

Page({
    data: {
        isLogin: false,
        userInfo: {},
        title: {},
        tabsIndex: 0,
        forumInfo: {},
        allList: [],
        newList: [],
        marrowList: []
    },
    onLoad(data) {
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        const { title, boardId } = data
        this.setData({ title })

        app.api.forum(boardId, { sortby: 'all' }).then(res => {
            const { list: allList, forumInfo, total_num, topTopicList } = res
            this.setData({
                allList: formateList(allList),
                forumInfo,
                topTopicList,
                totalNum: total_num
            })
        })
        app.api.forum(boardId, { sortby: 'new' }).then(res => {
            const { list: newList } = res
            this.setData({ newList: formateList(newList) })
        })
        app.api.forum(boardId, { sortby: 'marrow' }).then(res => {
            const { list: marrowList } = res
            this.setData({ marrowList: formateList(marrowList) })
        })
    },
    onReady() {
        const { title } = this.data
        wx.setNavigationBarTitle({ title })
    },
    changeTabs(e) {
        const { index: tabsIndex } = e.currentTarget.dataset
        this.setData({ tabsIndex })
    },
    swiperChange(e) {
        const { current: tabsIndex } = e.detail
        this.setData({ tabsIndex })
    }
})


function formateList(list) {
    list.forEach(item => {
        item.imageList = item.imageList.map(src =>
            src.replace('xgsize_', 'mobcentSmallPreview_')
        )
        if (item.imageList.length > 3) {
            item.imageList.length = 3
        }
        item.last_reply_date = formatTime(item.last_reply_date)
    })
    return list
}
