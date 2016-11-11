const ListComponent = require('../../lib/listcomponent')
const util = require('../../utils/util.js')

const app = getApp()

function TopiclistComplex(key, module) {
    ListComponent.call(this, key)
    // 添加分页
    this.data = {
        page: 0,
        pageNumber: 20,
        module,
        resources: {},
        tabsIndex: 0,
        isLoading: false,
        showList: true,
        iconSrc: app.globalData.iconSrc,
        orderby: module.extParams.orderby,
        appIcon: app.globalData.info.appIcon,
        over: false
    }
}

TopiclistComplex.prototype = Object.create(ListComponent.prototype)
TopiclistComplex.prototype.name = 'topiclistcomplex'
TopiclistComplex.prototype.constructor = TopiclistComplex
// 请求数据
TopiclistComplex.prototype.fetchData = function (param, number) {
    const module = this.data.module
    let list = param.list || this.data.resources.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return Promise.all([
        app.api.forumList({ fid: module.extParams.forumId }),
        app.api.forum(module.extParams.forumId, {
            page: param.page,
            sortby: param.orderby || 'all'
        })
    ]).then(([ boardChild, data ]) => {
        let hasChildrens = false
        try {
            hasChildrens = !!boardChild.list[0].board_list.length
            boardChild = boardChild.list[0].board_list
            boardChild.forEach((v) => {
                v.last_reply_date = util.formatTime(v.last_reply_date)
                v.last_posts_date = util.formatTime(v.last_posts_date)
            })
        } catch (err) {
            hasChildrens = false
        }
        data.list = list.concat(data.list)
        if (data.page == 1) {
            this.setData({
                topTopicList: data.topTopicList
            })
        }
        let navWidth = '33.33333%'
        if (hasChildrens) {
            navWidth = '25%'
        }
        let appIcon = (data.forumInfo && data.forumInfo.icon) || app.globalData.loadSrc
        this.setData({
            resources: data,
            isLoading: false,
            appIcon,
            hasChildrens,
            boardChild,
            navWidth,
            over: param.page >= parseInt((data.total_num / number) + 1, 10)
        })
    }, () => {
        this.setData({ resources: {}, over: true, isLoading: false })
    })
}
// 查看子版块
TopiclistComplex.prototype.checkchild = function (e) {
    app.showTopic(e.currentTarget.dataset)
}
// 查看详情
TopiclistComplex.prototype.clickItem = function (e) {
    if (e.target.dataset.role == 'avatar') {
        if (app.isLogin()) return
        return wx.navigateTo({
            url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.user })}`
        })
    }
    app.showPost(e.currentTarget.id)
}
// 切换orderby
TopiclistComplex.prototype.changeTabs = function (e) {
    const { index, sort } = e.currentTarget.dataset
    const tabsIndex = Number(index)
    this.setData({ tabsIndex, orderby: sort, over: false })
    if (tabsIndex == 3) {
        return this.setData({
            showList: false,
            over: true
        })
    }
    this.orderby = sort
    this.setData({ tabsIndex, orderby: sort, showList: true, over: false })
    this.pageIndex = 1
    this.fetchData({
        page: this.pageIndex,
        list: [],
        orderby: sort
    }, 20)
}
// 发表帖子
TopiclistComplex.prototype.handleEditClick = function () {
    const forumId = this.data.module.extParams.forumId
    app.createForum({
        forumId,
        actType: 'new'
    })
}
// 关注话题
TopiclistComplex.prototype.focusForum = function (e) {
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
module.exports = TopiclistComplex
