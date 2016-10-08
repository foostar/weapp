var app = getApp()
var { formatTime } = require('../../../utils/util.js')

Page({
    data: {
        isLogin: false,
        userInfo: {},
        title: {},
        tabsIndex: 0,
        forumInfo: {},
        allList: {
            list: [],
            nextPage: 1,
            hasNext: true
        },
        newList: {
            list: [],
            nextPage: 1,
            hasNext: true
        },
        marrowList: {
            list: [],
            nextPage: 1,
            hasNext: true
        },
        currentList: {
            list: [],
            nextPage: 1,
            hasNext: true
        }
    },
    onLoad(data) {
        if (app.globalData.userInfo) { // 判断用户是否登录
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        const { title, boardId } = data // 存导航栏标题, onReady 再设置
        this.setData({ title })

        const getList = (sortby = 'all') => app.api.forum(boardId, { sortby }).then(res => {
            const {
                list,
                page,
                forumInfo,
                topTopicList,
                has_next,
                total_num: totalNum
            } = res

            const _list = formateList(list)

            this.setData({
                [`${sortby}List`]: {
                    list: _list,
                    nextPage: page + 1,
                    hasNext: !!has_next
                }
            })

            if (sortby === 'all') {
                this.setData({
                    currentList: {
                        list: _list,
                        nextPage: page + 1,
                        hasNext: !!has_next
                    },
                    forumInfo,
                    topTopicList,
                    totalNum
                })
            }
        })

        getList('all')
        getList('new')
        getList('marrow')
    },
    onReady() {
        const { title } = this.data
        wx.setNavigationBarTitle({ title }) // 设置导航栏标题
    },
    changeTabs(e) {
        const { index } = e.currentTarget.dataset
        const tabsIndex = Number(index)
        const currentList = tabsIndex === 0
            ? this.data.allList
            : tabsIndex === 1
                ? this.data.newList
                : this.data.marrowList

        console.log(currentList)
        console.log(this.data)

        this.setData({ tabsIndex, currentList })
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
