const ListComponent = require('../../lib/listcomponent')
const util = require('../../utils/util.js')

const app = getApp()
function TopiclistSimple(key, module) {
    ListComponent.call(this, key)
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
        globalFetch: app.globalData.globalFetch,
        appIcon: app.globalData.info.appIcon,
        over: false
    }
}

TopiclistSimple.prototype = Object.create(ListComponent.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
TopiclistSimple.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

// 请求数据
TopiclistSimple.prototype.fetchData = function (page, number) {
    const module = this.data.module
    let list = this.data.resources.list ? this.data.resources.list : []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.forum(module.extParams.forumId, {
        page,
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            let faceResult = util.infoToFace(v.subject)
            v.hasFace = faceResult.hasFace
            v.subject = faceResult.data
            return v
        })
        data.list = list.concat(data.list)
        this.setData({
            module,
            resources: data,
            isLoading: false,
            over: page >= parseInt((data.total_num / number) + 1, 10)
        })
    })
}

TopiclistSimple.prototype.focusForum = function (e) {
    const self = this
    const boardId = e.target.dataset.id
    if (e.target.dataset.focus == 1) {
        return app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
            var resources = self.data.resources
            resources.forumInfo.is_focus = 0
            self.setData({
                resources
            })
        })
    }
    app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
        var resources = self.data.resources
        resources.forumInfo.is_focus = 1
        self.setData({
            resources
        })
    })
}

module.exports = TopiclistSimple
