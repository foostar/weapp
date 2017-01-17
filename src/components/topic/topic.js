const ListComponent = require('../../lib/listcomponent.js')
const util = require('../../utils/util.js')

const app = getApp()
// 话题页面

function Topic(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    this.module = module
    ListComponent.call(this, key)
    this.data = {
        ti_id: '',
        fid: null,
        id: '',
        tpcinfo: {},
        topUser: [],
        partinNum: 0,
        newList: [],
        hotList: [],
        currentIndex: 1
    }
}
Topic.prototype = Object.create(ListComponent.prototype)
Topic.prototype.name = 'topic'
Topic.prototype.constructor = Topic


Topic.prototype.fetchData = function (param, number) {
    const currentIndex = parseInt(this.data.currentIndex, 10)
    // NEW HOT
    /* eslint-disable */
    const ti_id = (this.papeData ? this.papeData.id : null) || this.module.extParams.talkId
    /* eslint-enable */
    let list = param.list || currentIndex === 1 ? this.data.newList : this.data.hotList || []
    if (this.data.over) return Promise.reject()
    this.setData({
        ti_id,
        isLoading: true,
        color: `#${app.config.COLOR}`
    })
    const options = {
        ti_id,
        page: param.page,
        orderby: currentIndex === 1 ? 'NEW' : 'HOT'
    }
    /* eslint-disable */
    if (this.papeData && this.papeData.type == 'tid') {
        delete options.ti_id
        options.tid = ti_id
    }
    /* eslint-enable */
    return app.api.topicdtl(options).then((data) => {
        data.list = data.list.map(item => {
            item.subject = util.formateText(item.subject)
            item.repliedAt = util.dateFormat(item.repliedAt, 'yyyy-MM-dd')
            return item
        })


        data.list = list.concat(data.list)

        if (data.meta.page == 1) {
            this.setData({
                tpcinfo: data.tpcinfo,
                topUser: data.topUser,
                partinNum: data.partinNum,
                fid: data.tpcinfo.fid
            })
        }
        if (currentIndex === 1) {
            this.setData({
                newList: data.list,
                isLoading: false,
                fid: data.tpcinfo.fid,
                over: param.page >= parseInt((data.meta.total / number) + 1, 10)
            })
        } else {
            this.setData({
                hotList: data.list,
                isLoading: false,
                fid: data.tpcinfo.fid,
                over: param.page >= parseInt((data.meta.total / number) + 1, 10)
            })
        }
    }, () => {
        this.setData({ resources: {}, over: true, isLoading: false })
    })
}

Topic.prototype.changeTabs = function (e) {
    // 切换选项卡
    this.setData({
        currentIndex: e.currentTarget.dataset.index
    })
    const { index } = e.currentTarget.dataset
    const currentIndex = Number(index)
    this.setData({ currentIndex, newList: [], hotList: [], over: false })
    this.pageIndex = 1
    this.fetchData({
        page: this.pageIndex
    }, 20)
}
Topic.prototype.toUserHome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}
Topic.prototype.clickItem = function (e) {
    app.showPost({ type: 'post', id: e.currentTarget.id })
}

// 发表话题帖子
Topic.prototype.handleEditClick = function (e) {
    const tiId = e.currentTarget.dataset.tiid
    app.createForum({
        tiId,
        fid: this.data.fid,
        isTopic: true,
        actType: 'new'
    })
}

Topic.prototype.onShareAppMessage = function () {
    const { tpcinfo: { ti_title: title, ti_content: desc } } = this.data
    let path = `/pages/blank/blank?type=topic&data=${JSON.stringify({ id: this.papeData.id })}`
    return {
        title,
        desc,
        path
    }
}

module.exports = Topic
