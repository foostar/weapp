const Component = require('../../lib/component')

const app = getApp()

function ForumlistSplit(key, module) {
    Component.call(this, key)
    this.module = module
}

ForumlistSplit.prototype = Object.create(Component.prototype)
ForumlistSplit.prototype.name = 'forumlistsplit'
ForumlistSplit.prototype.constructor = ForumlistSplit

ForumlistSplit.prototype.onLoad = function () {
    // this.page.disableScroll()
    // 判断用户是否登录
    if (app.globalData.userInfo) {
        this.setData({
            isLogin: true,
            userInfo: app.globalData.userInfo
        })
    }
    app.event.on('login', (userInfo) => {
        this.setData({
            isLogin: !!userInfo,
            userInfo
        })
        this.fetchData()
    })
    this.fetchData()
}
ForumlistSplit.prototype.fetchData = function () {
    app.getResources(this.module).then((resources) => {
        this.setData({
            currentBoard: 10000,
            currentBoardList: resources[this.module.id].rec.recommendedBoard,
            resources: resources[this.module.id],
            isLoading: true,
            module
        })
    })
}

/*
 *  @切换版块关注列表
 */
ForumlistSplit.prototype.changeBoard = function(e) {
    var self = this
    self.setData({
        currentBoard: e.target.dataset.id,
    })
    if (e.target.dataset.id == 10000) {
        return self.setData({
            currentBoardList: this.data.resources.rec.recommendedBoard
        })
    }
    this.data.resources.list.forEach((v) => {
        if (v.board_category_id == e.target.dataset.id) {
            self.setData({
                currentBoardList: v.board_list
            })
        }
    })
},
/*
 *   @ 关注和取消关注话题
 */
ForumlistSplit.prototype.focusBoard = function(event) {
    var self = this
    var boardId = event.target.dataset.id
    const moduleId = this.module.id
    if (event.target.dataset.role) {
        if (!app.isLogin()) return
        self.setData({
            isLoading: false
        })
        if (event.target.dataset.role == 'focus') {
            app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
                var recommendedBoard
                var addedfocusBoard
                if (self.data.currentBoard == 10000) {
                    // 增加关注列表
                    addedfocusBoard = self.data.resources.rec.recommendedBoard.filter(item => item.board_id == boardId)[0]
                    // 减去推荐列表
                    recommendedBoard = self.data.resources.rec.recommendedBoard.filter(item => item.board_id != boardId)
                    self.data.resources.rec.recommendedBoard = recommendedBoard
                    // 重新拉取数据
                    // self.fetchData()
                } else {
                    // 改变列表中关注的状态值
                    self.data.resources.list.forEach(item => {
                        if (item.board_category_id == self.data.currentBoard) {
                            addedfocusBoard = item.board_list.filter(board => board.board_id == boardId)[0]
                            item.board_list.forEach(board => {
                                if (board.board_id == boardId) {
                                    board.is_focus = 1
                                }
                            })
                        }
                    })
                }
                self.data.resources.rec.focusBoard.push(addedfocusBoard)
                // 更改当前页面列表里的状态值
                self.data.currentBoardList.forEach(item => {
                    if (item.board_id == boardId) {
                        item.is_focus = 1
                    }
                })
                self.setData({
                    // resources: self.data.resources,
                    // currentBoardList: self.data.currentBoardList,
                    isLoading: true
                })
            })
        }
        if (event.target.dataset.role == 'unfocus') {
            app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
                // 减去关注列表
                var focusBoard = self.data.resources.rec.focusBoard.filter(item => item.board_id != boardId)
                self.data.resources.rec.focusBoard = focusBoard
                // 改变列表中关注的状态值
                self.data.resources.list.forEach(item => {
                    item.board_list.forEach(board => {
                        if (board.board_id == boardId) {
                            board.is_focus = 0
                        }
                    })
                })
                self.setData({
                    // resources: self.data.resources,
                    isLoading: true
                })
            })
        }
    }
},

module.exports = ForumlistSplit