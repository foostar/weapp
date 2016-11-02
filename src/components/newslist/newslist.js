const Component = require('../../lib/component')
const util = require('../../utils/util')

const app = getApp()
function NewsList(key, module) {
    Component.call(this, key)
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
        appIcon: app.globalData.info.appIcon,
        endPage: 0,
        over: false
    }
}

NewsList.prototype = Object.create(Component.prototype)
NewsList.prototype.name = 'newslist'
NewsList.prototype.constructor = NewsList
NewsList.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

NewsList.prototype.onLoad = function () {
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
NewsList.prototype.fetchData = function (module, page) {
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
}

module.exports = NewsList
