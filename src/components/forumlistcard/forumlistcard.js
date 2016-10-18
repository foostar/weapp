const Component = require('../../lib/component')
const { formatTime } = require('../../utils/util')

const app = getApp()

function ForumlistCard(key) {
    Component.call(this, key)
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
}

ForumlistCard.prototype = Object.create(Component.prototype)
ForumlistCard.prototype.name = 'forumlistcard'
ForumlistCard.prototype.constructor = ForumlistCard

ForumlistCard.prototype.navigator = function (e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
}

module.exports = ForumlistCard
