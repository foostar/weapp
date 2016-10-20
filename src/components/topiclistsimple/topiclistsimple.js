const Component = require('../../lib/component')
const util = require('../../utils/util')

const app = getApp()

function TopiclistSimple(key, module) {
    Component.call(this, key)
    let forumInfo = true
    const topicList = [ '官方公告', '站长访谈' ]
    topicList.forEach((v) => {
        if (v == module.title) {
            forumInfo = false
        }
    })
    console.log(forumInfo,module)
    app.api.forum(module.extParams.forumId, {
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        console.log("data",data)
        data.list = data.list.map((v) => {
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.formatTime(v.last_reply_date)
            v.subject = util.formateText(v.subject)
            return v
        })
        this.setData({
            module,
            resources: data,
            isLoading: true,
            forumInfo,
            appIcon: app.globalData.info.appIcon
        })
    })
}

TopiclistSimple.prototype = Object.create(Component.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
TopiclistSimple.prototype.focusForum = function (e) {
    const self = this
    const boardId = e.target.dataset.id
    self.setData({
        isLoading: false
    })
    if (e.target.dataset.focus == 1) return
    app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
        var resources = self.data.resources
        resources.forumInfo.is_focus = 1
        self.setData({
            resources,
            isLoading: true
        })
    })
}
module.exports = TopiclistSimple
