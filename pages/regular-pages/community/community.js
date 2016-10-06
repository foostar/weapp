var app = getApp()
var {formatTime} = require('../../../utils/util.js')

Page({
    data: {
        isLogin: false,
        tabs: [],
        userInfo: {},
        list: []
    },
    onLoad() {
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        // 设置tabs
        this.setData({
            tabs: app.globalData.tabs
        })

        // 获取用户的主配置信息
        app.api.forumList().then(res => {
            const { list } = res
            list.forEach(boardCategory => {
                boardCategory.board_list.forEach(board => {
                    board.url = `/pages/regular-pages/forum/forum?boardId=${board.board_id}&title=${board.board_name}`
                    board.last_posts_date = formatTime(board.last_posts_date)
                })
            })
            this.setData({ list })
        })
    },
    // 改变全局的moduleId
    changeModuleId(e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    },
    navigator(e) {
        const { url } = e.currentTarget.dataset
        wx.navigateTo({ url })
    }
})
