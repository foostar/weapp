const ListComponent = require('../../lib/listcomponent.js')

const app = getApp()
function TopiclistSimple(key, module) {
    ListComponent.call(this, key)
    let forumInfo = true
    const topicList = [ '官方公告', '站长访谈' ]
    this.orderby = module.extParams.orderby || 'all'
    topicList.forEach((v) => {
        if (v == module.title) {
            forumInfo = false
        }
    })
    this.module = module
    if (module.data) {
        this.orderby = module.data.orderby
    }
    app.globalData.liststyle = module.style
    // 添加分页
    this.data = {
        page: 1,
        style: module.style,
        forumInfo,
        resources: {},
        iconSrc: app.globalData.iconSrc,
        isLoading: false,
        appIcon: app.globalData.info.appIcon,
        over: false,
        isShow: false
    }
}

TopiclistSimple.prototype = Object.create(ListComponent.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
TopiclistSimple.prototype.clickItem = function (e) {
    if (e.target.dataset.role == 'avatar') {
        if (e.currentTarget.dataset.user) {
            return app.showUserHome(e.currentTarget.dataset.user)
        }
        const showError = () => {
            this.setData({
                isShow: true,
                errMessage: '此用户为匿名用户，不可查看！'
            })
            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 800)
        }
        return showError()
    }
    if (e.target.dataset.role == 'forumName') {
        return app.showTopic({
            eventKey: e.currentTarget.dataset.eventKey,
            id: e.target.dataset.id,
            title: e.target.dataset.title
        })
    }
    app.showPost({ type: 'post', id: e.currentTarget.id })
}

// 请求数据
TopiclistSimple.prototype.fetchData = function (param, number) {
    const module = this.module
    let list = param.list || this.data.resources.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.forum(module.extParams.forumId, {
        page: param.page,
        orderby: param.orderby || 'all'
    }).then((data) => {
        data.list = list.concat(data.list)
        if (data.meta.page == 1) {
            this.setData({
                topTopicList: data.topTopicList
            })
        }
        let appIcon = (data.forumInfo && data.forumInfo.icon) || app.globalData.loadSrc
        this.setData({
            resources: data,
            isLoading: false,
            appIcon,
            over: param.page >= parseInt((data.meta.total / number) + 1, 10)
        })
    }, (err) => {
        return Promise.reject(err)
    })
}

TopiclistSimple.prototype.focusForum = function (e) {
    if (!e.target.dataset.role) return
    if (!app.isLogin()) return
    const boardId = e.target.dataset.id
    if (e.target.dataset.focus == 1) {
        return app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
            var resources = this.data.resources
            resources.forumInfo.is_focus = 0
            this.setData({
                resources
            })
        })
    }
    app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
        var resources = this.data.resources
        resources.forumInfo.is_focus = 1
        this.setData({
            resources
        })
    })
}

module.exports = TopiclistSimple
