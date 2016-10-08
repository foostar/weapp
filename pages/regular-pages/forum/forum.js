var app = getApp()
var { formatTime } = require('../../../utils/util.js')

Page({
    data: {
        boardId: null,
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
        this.setData({ title, boardId })

        this.getList('all', true)
        this.getList('new', true)
        this.getList('marrow', true)
    },
    onReady() {
        const { title } = this.data
        wx.setNavigationBarTitle({ title }) // 设置导航栏标题
    },
    getList(sortby, init = false) {
        if (!sortby) return console.info('需要 sortby 参数')

        const {boardId} = this.data

        const {hasNext, nextPage} = this.data[`${sortby}List`]

        if (!hasNext) {
            return console.info(`${sortby} 分类下已经没有更多内容了.`)
        }

        app.api.forum(boardId, { sortby, page: nextPage }).then(res => {
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
                    list: this.data[`${sortby}List`].list.concat(_list),
                    nextPage: page + 1,
                    hasNext: !!has_next
                }
            })


            if (init && sortby === 'all') {
                this.setData({
                    currentList: {
                        list: this.data.currentList.list.concat(_list),
                        nextPage: page + 1,
                        hasNext: !!has_next
                    },
                    forumInfo,
                    topTopicList,
                    totalNum
                })
            } else {
                this.setData({
                    currentList: {
                        list: this.data.currentList.list.concat(_list),
                        nextPage: page + 1,
                        hasNext: !!has_next
                    }
                })
            }
        })
    },
    changeTabs(e) {
        const { index } = e.currentTarget.dataset
        const tabsIndex = Number(index)
        const currentList = tabsIndex === 0
            ? this.data.allList
            : tabsIndex === 1
                ? this.data.newList
                : this.data.marrowList

        this.setData({ tabsIndex, currentList })
    },
    scrollToBottom(e) {
        const {tabsIndex} = this.data
        tabsIndex === 0
            ? this.getList('all')
            : tabsIndex === 1
                ? this.getList('new')
                : this.getList('marrow')
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
