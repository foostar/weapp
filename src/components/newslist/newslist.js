const ListComponent = require('../../lib/listcomponent')
const util = require('../../utils/util')

const app = getApp()
function NewsList(key, module) {
    ListComponent.call(this, key)
    this.module = module
    // 添加分页
    this.data = {
        page: 1,
        module,
        indicatorDots: false,
        autoplay: true,
        interval: 3000,
        duration: 800,
        resources: {},
        isLoading: false,
        iconSrc: app.globalData.iconSrc,
        appIcon: app.globalData.info.appIcon,
        endPage: 0,
        over: false
    }
}

NewsList.prototype = Object.create(ListComponent.prototype)
NewsList.prototype.name = 'newslist'
NewsList.prototype.constructor = NewsList

NewsList.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}
// 请求数据
NewsList.prototype.fetchData = function (param, number) {
    const module = this.module
    let list = param.list || this.data.resources.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.news(module.extParams.newsModuleId, {
        page: param.page,
        sortby: param.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            v.subject = v.summary
            v.last_reply_date = util.formatTime(v.last_reply_date)
            v.subject = util.formateText(v.subject)
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
    }, (err) => {
        return Promise.reject(err)
    })
}
// 请求数据
/* NewsList.prototype.fetchData = function (module, page) {
    let list = this.data.resources.list ? this.data.resources.list : []
    app.api.news(module.extParams.newsModuleId, {
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
        this.setData({
            module,
            page,
            resources: data,
            isLoading: true,
            endPage: parseInt((data.total_num / 20) + 1, 10)
        })
    })
}*/

module.exports = NewsList
