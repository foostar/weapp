const Component = require('../../lib/component')
const util = require('../../utils/util')

const app = getApp()

function TopiclistSimple(key, module) {
    Component.call(this, key)
    app.api.forum(module.extParams.forumId, {
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.formatTime(v.last_reply_date)
            v.subject = util.formateText(v.subject)
            return v
        })
        this.setData({
            module,
            resources: data
        })
    })
}

TopiclistSimple.prototype = Object.create(Component.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple

module.exports = TopiclistSimple
