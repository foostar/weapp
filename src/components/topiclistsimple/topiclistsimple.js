const Component = require('../../lib/component')

const app = getApp()
var i = 1
function TopiclistSimple(key, module) {
    Component.call(this, key)
    // 添加分页
    this.data = {
        page:1,
        module,
        resources: {},
        isLoading: false,
        appIcon: app.globalData.info.appIcon,
        endPage: 0
    }
}

TopiclistSimple.prototype = Object.create(Component.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
TopiclistSimple.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

TopiclistSimple.prototype.onLoad = function(){
    this.fetchData(this.data.module, this.data.page)
    let that = this
    // 加载下一页的数据
    app.event.on('nextPage', function(){
        let { page, endPage } = that.data
        if (page < endPage) {
            that.fetchData(that.data.module, page + 1)
        }
    })
}
// 请求数据
TopiclistSimple.prototype.fetchData = function (module, page){
    let list = this.data.resources.list ? this.data.resources.list : []
    let forumInfo = true
    const topicList = [ '官方公告', '站长访谈' ]
    topicList.forEach((v) => {
        if (v == module.title) {
            forumInfo = false
        }
    })
    app.api.forum(module.extParams.forumId, {
        page,
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.formatTime(v.last_reply_date)
            v.subject = util.formateText(v.subject)
            return v
        })
        data.list = list.concat(data.list)
        console.log(data)
        this.setData({
            module,
            page,
            resources: data,
            isLoading: true,
            endPage: parseInt(data.total_num / 20 + 1),
            forumInfo
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
    if (e.target.dataset.focus == 1) {
        return app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
            var resources = self.data.resources
            resources.forumInfo.is_focus = 0
            self.setData({
                resources,
                isLoading: true
            })
        })
    }
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
