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
    // 添加分页
    this.data = {
        page: 1,
        module,
        forumInfo,
        resources: {},
        isLoading: false,
        appIcon: app.globalData.info.appIcon,
        endPage: 0,
        over: false
    }
}

TopiclistSimple.prototype = Object.create(Component.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
TopiclistSimple.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

TopiclistSimple.prototype.onLoad = function () {
    app.event.trigger('golbal-fetching')
    this.fetchData(this.data.module, this.data.page)
    let that = this
    // 加载下一页的数据
    app.event.on('nextPage', () => {
        let { page, endPage } = that.data
        if (page < endPage) {
            that.setData({
                isLoading: true
            })
            that.fetchData(that.data.module, page + 1)
        } else {
            that.setData({
                isLoading: false,
                over: true
            })
        }
    })
}
// 请求数据
TopiclistSimple.prototype.fetchData = function (module, page) {
    let list = this.data.resources.list ? this.data.resources.list : []
    app.api.forum(module.extParams.forumId, {
        page,
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            let faceResult
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.formatTime(v.last_reply_date)
            v.subject = util.formateText(v.subject)
            faceResult = util.infoToFace(v.subject)
            v.hasFace = faceResult.hasFace
            v.subject = faceResult.data
            return v
        })
        data.list = list.concat(data.list)
        console.log('data', data)
        app.event.trigger('golbal-done')
        this.setData({
            module,
            page,
            resources: data,
            isLoading: true,
            endPage: parseInt((data.total_num / 20) + 1, 10)
        })
    })
}

TopiclistSimple.prototype.focusForum = function (e) {
    const self = this
    const boardId = e.target.dataset.id
    app.event.trigger('golbal-fetching')
    if (e.target.dataset.focus == 1) {
        return app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
            var resources = self.data.resources
            resources.forumInfo.is_focus = 0
            app.event.trigger('golbal-done')
            self.setData({
                resources
            })
        })
    }
    app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
        var resources = self.data.resources
        resources.forumInfo.is_focus = 1
        app.event.trigger('golbal-done')
        self.setData({
            resources
        })
    })
}

module.exports = TopiclistSimple
