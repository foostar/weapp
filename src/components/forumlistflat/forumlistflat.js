const Component = require('../../lib/component')
const { dateFormat } = require('../../utils/util')

const app = getApp()

function ForumlistFlat(key) {
    Component.call(this, key)
    app.api.forumList().then((res) => { // 获取用户的主配置信息
        const { list } = res
        list.forEach((boardCategory) => {
            boardCategory.board_list.forEach((board) => {
                board.last_posts_date = dateFormat(board.last_posts_date, 'yyyy-MM-dd')
            })
        })
        this.setData({ list })
    })
}

ForumlistFlat.prototype = Object.create(Component.prototype)
ForumlistFlat.prototype.name = 'forumlistflat'
ForumlistFlat.prototype.constructor = ForumlistFlat

ForumlistFlat.prototype.navigator = function (e) {
    app.showTopic(e.currentTarget.dataset)
}

module.exports = ForumlistFlat
