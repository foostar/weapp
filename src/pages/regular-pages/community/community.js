const app = getApp()
const { formatTime } = require('../../../utils/util.js')

Page({
    data: {
        isLogin: false,
        tabs: [],
        userInfo: {},
        list: []
    },
    onLoad() {
        if (app.globalData.userInfo) { // 判断用户是否登录
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        this.setData({ // 设置tabs
            tabs: app.globalData.tabs
        })

        app.api.forumList().then((res) => { // 获取用户的主配置信息
            const { list } = res
            list.forEach((boardCategory) => {
                boardCategory.board_list.forEach((board) => {
                    board.url = `/pages/regular-pages/forum/forum?boardId=${board.board_id}&title=${board.board_name}`
                    board.last_posts_date = formatTime(board.last_posts_date)
                })
            })
            this.setData({ list })
        })
    },
    changeModuleId(e) { // 改变全局的moduleId
        app.to(e.currentTarget.dataset.moduleId, true)
    },
    navigator(e) {
        const { url } = e.currentTarget.dataset
        wx.navigateTo({ url })
    }
})
