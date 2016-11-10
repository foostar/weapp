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
    if (!app.isLogin()) return
    const module = this.data.module
    let list = param.list || this.data.resources.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.forum(module.extParams.forumId, {
        page: param.page,
        sortby: param.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            let faceResult = util.infoToFace(v.subject)
            v.hasFace = faceResult.hasFace
            v.subject = faceResult.data
            return v
        })
        data.list = list.concat(data.list)
        if (data.page == 1) {
            this.setData({
                topTopicList: data.topTopicList
            })
        }
        this.setData({
            resources: data,
            isLoading: false,
            over: param.page >= parseInt((data.total_num / number) + 1, 10)
        })
    }, () => {
        this.setData({ resources: {}, over: true, isLoading: false })
    })
}
// 切换orderby
TopiclistComplex.prototype.changeTabs = function (e) {
    const { index, sort } = e.currentTarget.dataset
    const tabsIndex = Number(index)
    this.orderby = sort
    this.setData({ tabsIndex, orderby: sort, over: false })
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
module.exports = TopiclistComplex
